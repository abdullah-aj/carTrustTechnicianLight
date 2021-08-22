package com.cartrustappbiz.mpos;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.os.AsyncTask;
import android.os.Handler;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.mpos.alhamrani.alhamrani_mpos_library.AlhamraniECR;
import com.mpos.alhamrani.alhamrani_mpos_library.model.ECRResponse;

import java.util.List;
import java.util.Random;

import static android.os.Looper.getMainLooper;

public class MPOSManager {
    public interface MPOSManagerListener {
        void onMPOSDeviceConnectionStatusUpdate(boolean isConnected, String message);

        void onMPOSTransactionResult(ECRResponse response, String message);
    }

    private AlhamraniECR alhamraniECR;
    private ReactApplicationContext context;
    private boolean isConnected = false;
    private MPOSManagerListener mposManagerListener;
    private String amount, mobileNumber;

    public MPOSManager(String amount, String mobileNumber, ReactApplicationContext context, MPOSManagerListener mposManagerListener) {
        this.context = context;
        this.amount = amount;
        this.mobileNumber = mobileNumber;
        this.mposManagerListener = mposManagerListener;
        alhamraniECR = new AlhamraniECR(context, context.getPackageName());
    }

    public void connectDevice() {
        if (isConnected)
            connectedSuccess();
        else
            new MakeConnection().execute();
    }

    public void sendTransaction() {
        if (isConnected) {
            Toast.makeText(context, "Making transaction", Toast.LENGTH_SHORT).show();
            int rcptNo = (int) (System.currentTimeMillis() / 10000);
            new ECRTransaction("" + generateECRNO(), "" + rcptNo, "PUR", this.amount,
                    this.mobileNumber, "", "", "2").execute();
        } else {
            Toast.makeText(context, " MPOS device not connected.", Toast.LENGTH_SHORT).show();
        }
    }

    private int generateECRNO() {
        Random random = new Random();
        // generate a random integer from 0 to 899, then add 100
        return random.nextInt(900) + 100;
    }

    @SuppressLint("StaticFieldLeak")
    private class ECRTransaction extends AsyncTask<Void, Void, Object> {
        private final String ECR_NO, ECR_RECEIPT_NO, MSGID, AMOUNT, MOBILE, CASHBACK, RRN, LANG_OF_TXT;

        public ECRTransaction(String ECR_NO, String ECR_RECEIPT_NO, String MSGID, String amount, String mobile,
                              String cashback, String RRN, String languageOfText) {
            this.ECR_NO = ECR_NO;
            this.ECR_RECEIPT_NO = ECR_RECEIPT_NO;
            this.MSGID = MSGID;
            this.AMOUNT = amount;
            this.MOBILE = mobile;
            this.CASHBACK = cashback;
            this.RRN = RRN;
            this.LANG_OF_TXT = languageOfText;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(context, "Transaction started...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected Object doInBackground(Void... voids) {
            return alhamraniECR.sendECRTransaction(ECR_NO, ECR_RECEIPT_NO, MSGID, AMOUNT,
                    MOBILE, CASHBACK, RRN, LANG_OF_TXT);
        }

        @Override
        protected void onPostExecute(Object obj) {
            super.onPostExecute(obj);
            Toast.makeText(context, "Transaction Result is: " + obj, Toast.LENGTH_SHORT).show();
            if (obj != null) {
                ECRResponse response = (ECRResponse) obj;
                if (response != null) {
                    if (mposManagerListener != null) {
                        String message = "RESPONSE CODE: " + response.responseField.get(0).response_code + "\n"
                                + "AMOUNT: " + response.responseField.get(0).amount;
                        mposManagerListener.onMPOSTransactionResult(response, message);
                    }
                }
            }
        }
    }

    private class MakeConnection extends AsyncTask<Void, Void, Boolean> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            List<BluetoothDevice> devices = alhamraniECR.getPairedDevices();
            if (devices != null && devices.size() > 0) {
                Toast.makeText(context, "Connecting....", Toast.LENGTH_LONG).show();
            } else {
                isConnected = false;
                if (mposManagerListener != null)
                    Toast.makeText(context, "Device not found. Please pair MPOS device from bluetooth settings.", Toast.LENGTH_LONG).show();
            }
        }

        @Override
        protected Boolean doInBackground(Void... voids) {
            List<BluetoothDevice> devices = alhamraniECR.getPairedDevices();
            if (devices != null && devices.size() > 0 && !isConnected) {
                isConnected = alhamraniECR.connectToDevice(devices.get(0));
                return isConnected;
            }
            return isConnected;
        }

        @Override
        protected void onPostExecute(Boolean aBoolean) {
            super.onPostExecute(aBoolean);
            if (aBoolean != null && aBoolean) {
                new Handler(getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        connectedSuccess();
                    }
                }, 12000);
            } else connectionFailed();

        }
    }

    private void connectedSuccess() {
        if (mposManagerListener != null)
            mposManagerListener.onMPOSDeviceConnectionStatusUpdate(true, "Connected to MPOS");

    }

    private void connectionFailed() {
        if (mposManagerListener != null)
            mposManagerListener.onMPOSDeviceConnectionStatusUpdate(false, "Failed to connect MPOS");
    }

}
