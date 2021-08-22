package com.cartrustappbiz;
// MPOS

import android.app.Activity;
import android.content.Intent;
import android.telecom.Call;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;
import androidx.annotation.NonNull;

import com.cartrustappbiz.mpos.MPOSManager;
import com.cartrustappbiz.printer.PrinterActionsActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.Callback;
import com.mpos.alhamrani.alhamrani_mpos_library.model.ECRResponse;
import com.mpos.alhamrani.alhamrani_mpos_library.model.Receipt;
import com.mpos.alhamrani.alhamrani_mpos_library.model.ResponseField;

import org.json.JSONException;
import org.json.JSONObject;

public class CustomModule extends ReactContextBaseJavaModule implements MPOSManager.MPOSManagerListener {
    private final int PRINTER_SDK = 1001;
    private MPOSManager mposManager;
    public Callback callback;

    CustomModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(mActivityEventListener);
    }
 
    @NonNull
    @Override
    public String getName() {
        return "CustomModule";
    }
 
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
 
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == PRINTER_SDK) {
                if (callback != null) {
                    String message = data.getStringExtra(PrinterActionsActivity.RESULT_MESSAGE_KEY);
                    if (message != null)
                        callback.invoke(message);
                    else
                        callback.invoke("Empty message from printer SDK");
                }
            }
        }
    };
 
    @ReactMethod
    public void showToastMessage(String message){
        Log.e("CustomModule","Message from JS: "+message);
        Toast.makeText(getReactApplicationContext(),message,Toast.LENGTH_SHORT).show();
    }
 
 
    @ReactMethod
    public void startPrinterSDK(Callback callback){
        this.callback = callback;
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            callback.invoke("Activity doesn't exist");
            return;
        }
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(currentActivity, PrinterActionsActivity.class);
        currentActivity.startActivityForResult(intent,PRINTER_SDK);
    }
 
    @ReactMethod
    public void printQRCode(String qrCodeString){
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            callback.invoke("Activity doesn't exist");
            return;
        }
        Intent intent = new Intent(currentActivity, PrinterActionsActivity.class);
        intent.putExtra(PrinterActionsActivity.EXTERNAL_COMMAND_KEY,PrinterActionsActivity.CMD_PRINT_QR_CODE);
        intent.putExtra(PrinterActionsActivity.EXTERNAL_DATA_VALUE_KEY,qrCodeString);
        currentActivity.startActivityForResult(intent,PRINTER_SDK);
    }
 
 
    @ReactMethod
    public void printPicture(String picturePath){
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            callback.invoke("Activity doesn't exist");
            return;
        }
        Intent intent = new Intent(currentActivity, PrinterActionsActivity.class);
        intent.putExtra(PrinterActionsActivity.EXTERNAL_COMMAND_KEY,PrinterActionsActivity.CMD_PRINT_PICTURE);
        intent.putExtra(PrinterActionsActivity.EXTERNAL_DATA_VALUE_KEY,picturePath);
        currentActivity.startActivityForResult(intent,PRINTER_SDK);
    }
 
 
    @ReactMethod
    public void showMessageWithCallBack(String message, Callback callBack) {
        Integer eventId = 220;
        callBack.invoke(eventId);
    }
 
    @ReactMethod
    public void doMPOSTransaction(String amount,String mobileNumber,Callback callback){
        this.callback = callback;
        mposManager = new MPOSManager(amount,mobileNumber,getReactApplicationContext(),this);
        mposManager.connectDevice();
    }
 
    @Override
    public void onMPOSDeviceConnectionStatusUpdate(boolean isConnected,String message) {
        if (isConnected) {
            mposManager.sendTransaction();
        }else if (callback!=null)
            callback.invoke(message);
    }
    @Override
    public void onMPOSTransactionResult(ECRResponse response, String message) {
        if (callback != null) {
            callback.invoke(prepareResponseJson(response));
        }
    }
 
    private String prepareResponseJson(ECRResponse response){
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("id",response.id);
            jsonObject.put("transaction_type",response.transaction_type);
 
            JSONObject responseFieldObj = new JSONObject();
            if (response.responseField!=null && response.responseField.size() > 0) {
                ResponseField responseField = response.responseField.get(0);
                responseFieldObj.put("id",responseField.id);
                responseFieldObj.put("first_extra_code",responseField.first_extra_code);
                responseFieldObj.put("response_code",responseField.response_code);
                responseFieldObj.put("ecr_no",responseField.ecr_no);
                responseFieldObj.put("ECR_receipt",responseField.ECR_receipt);
                responseFieldObj.put("amount",responseField.amount);
                responseFieldObj.put("card_no",responseField.card_no);
                responseFieldObj.put("card_type",responseField.card_type);
                responseFieldObj.put("auth",responseField.auth);
                responseFieldObj.put("txt_date",responseField.txt_date);
                responseFieldObj.put("txt_time",responseField.txt_time);
                responseFieldObj.put("RRN",responseField.RRN);
                responseFieldObj.put("card_expire",responseField.card_expire);
                responseFieldObj.put("TID",responseField.TID);
                responseFieldObj.put("RRNOriginal",responseField.RRNOriginal);
                responseFieldObj.put("card_input_type",responseField.card_input_type);
                responseFieldObj.put("status",responseField.status);
            }
            jsonObject.put("responseField",responseFieldObj);
 
            JSONObject receiptObj = new JSONObject();
            if (response.receipt!=null && response.receipt.size() > 0){
                Receipt receipt = response.receipt.get(0);
                receiptObj.put("id",receipt.id);
 
 
                String receiptdata = Base64.encodeToString(receipt.receipt_data, Base64.DEFAULT);
                receiptObj.put("receipt_data",receiptdata);
                receiptObj.put("merchant_name_AR",receipt.merchant_name_AR);
                receiptObj.put("merchant_name_EN",receipt.merchant_name_EN);
                receiptObj.put("merchant_address_AR",receipt.merchant_address_AR);
                receiptObj.put("merchant_address_EN",receipt.merchant_address_EN);
                receiptObj.put("merchant_city_EN",receipt.merchant_city_EN);
                receiptObj.put("merchant_city_AR",receipt.merchant_city_AR);
                receiptObj.put("transaction_date",receipt.transaction_date);
                receiptObj.put("transaction_time",receipt.transaction_time);
                receiptObj.put("TID_MID_MCC_RRN_STAN_BANK",receipt.TID_MID_MCC_RRN_STAN_BANK);
                receiptObj.put("card_scheme",receipt.card_scheme);
                receiptObj.put("card_scheme_short",receipt.card_scheme_short);
                receiptObj.put("transaction_type",receipt.transaction_type);
                receiptObj.put("card_no",receipt.card_no);
                receiptObj.put("card_expiry",receipt.card_expiry);
                receiptObj.put("amount",receipt.amount);
                receiptObj.put("cashback",receipt.cashback);
                receiptObj.put("response",receipt.response);
                receiptObj.put("auth_code",receipt.auth_code);
                receiptObj.put("response_value",receipt.response_value);
                receiptObj.put("response_text_AR",receipt.response_text_AR);
                receiptObj.put("response_text_EN",receipt.response_text_EN);
                receiptObj.put("transaction_end_date",receipt.transaction_end_date);
                receiptObj.put("transaction_end_time",receipt.transaction_end_time);
                receiptObj.put("receipt_flag_customer_or_retailer",receipt.receipt_flag_customer_or_retailer);
                receiptObj.put("emv_data",receipt.emv_data);
                receiptObj.put("debit_credit",receipt.debit_credit);
                receiptObj.put("arab_campaign",receipt.arab_campaign);
                receiptObj.put("english_campaign",receipt.english_campaign);
                receiptObj.put("QR_code",receipt.QR_code);
                receiptObj.put("sign_flag",receipt.sign_flag);
                receiptObj.put("sign_area_flag",receipt.sign_area_flag);
 
                String encodedSignatureImage = Base64.encodeToString(receipt.signature_image, Base64.DEFAULT);
                receiptObj.put("signature_image",encodedSignatureImage);
            }
            jsonObject.put("receipt",receiptObj);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }
 }
 