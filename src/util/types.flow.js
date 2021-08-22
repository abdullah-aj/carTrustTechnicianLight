// @flow

export interface UtilInterface {
    Constants: ConstantInterface,
    Functions: FunctionsInterface,
    FormsValidations:FormValidation

}

export interface FunctionsInterface {
    FontSize(size: number): number;

    GetDeviceDimensions(): { width: number, height: number };

    HexToRgb(hex: string): string | null;

    MoneyFormat(amount: ?number, decimalCount: number, decimal: string, thousands: string): string;

    InitiateBluetooth(): void;

    GetBluetoothDevicesList(): Promise<{ name: string, address: string }[]>;

    StartBluetoothCapture(deviceId: string): void;

    StopBluetoothCapture(): void;

    StartBluetoothListener(listenerID: 'obd2bluetoothStatus' | 'obd2Status' | 'obd2LiveData', listenerFund: (data: { cmdID: string, cmdName: string, cmdResult: string } | 'connected' | 'disconnected' | 'error' | 'disable' | 'ready' | 'connecting' | 'receiving')=>void): Object;

    StopBluetoothListener(): void,

}

export interface ConstantInterface {
    LOGIN_STATUS: {
        LOGGED_IN: string
    }
}

export interface FormValidation{
    walkInCustomer:any

}
