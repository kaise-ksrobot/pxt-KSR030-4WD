/**
 * KSR030_4WD V0.010
 */
//% weight=10 color=#00A6F0 icon="\uf085" block="KSR030_4WD"
namespace KSR030_4WD {
     
    const IIC_ADDRESS = 0x40
    const LED0_ON_L = 0x06
      
    export enum MotorNum4WD {
        //% blockId="M1A" block="M1A"
        M1A = 0,
        //% blockId="M1B" block="M1B"
        M1B = 1,
        //% blockId="M2A" block="M2A"
        M2A = 2,
        //% blockId="M2B" block="M2B"
        M2B = 3,

    }

    export enum MecanumState {
        //% blockId="Go_Forward" block="Forward"
        Forward = 0,
        //% blockId="Car_Back" block="Backward"
        Back = 1,
        //% blockId="Go_Left" block="Left"
        Left = 2,
        //% blockId="GO_Right" block="Right"
        Right = 3,
        //% blockId="GO_Forward_Left" block="Forward_Left"
        Forward_Left = 4,
        //% blockId="GO_Forward_Right" block="Forward_Right"
        Forward_Right = 5,
        //% blockId="GO_Back_Left" block="Backward_Left"
        Back_Left = 6,
        //% blockId="GO_Back_Right" block="Backward_Right"
        Back_Right = 7,
        //% blockId="GO_Clockwise" block="Clockwise"
        Clockwise = 8,
        //% blockId="GO_Counterclockwise" block="Counterclockwise"
        Counterclockwise = 9,
        //% blockId="Go_Stop" block="Stop"
        Stop = 10,
     
    }

    function setPwm(channel: number, on: number, off: number): void {
		if (channel < 0 || channel > 15)
            return;

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on>>8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off>>8) & 0xff;
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
	}
   
    function motor_map(x: number)
    {
        x = x*16; // map 255 to 4096
		if(x > 4095){
			x= 4095;
		}
		if(x < -4095){
			x= -4095;
		}
        return x;
    }


 

    //% blockId=KSR030_4WD_Motor
    //% block="4WD Motor channel %channel|speed %speed"
	//% weight=85
	//% speed.min=-255 speed.max=255
	export function Motor_4WD(channel: MotorNum4WD, speed: number): void {
		
        let pwm1 =0;
        let pwm2 =0;
        speed=motor_map(speed);

        switch(channel){

            case 0:{
                pwm1 = 12;
                pwm2 = 13;                
                break;
            }
            case 1:{
                pwm1 = 14;
                pwm2 = 15;                
                break;
            }
            case 2:{
                pwm1 = 0;
                pwm2 = 1;               
                break;
            }
            case 3:{
                pwm1 = 2;
                pwm2 = 3;              
                break;
            }
            
        }
        
		if(speed>=0){
			setPwm(pwm1, 0, speed)
			setPwm(pwm2, 0, 0)
		}else{
			setPwm(pwm1, 0, 0)
			setPwm(pwm2, 0, -speed)
        }
            
    }

    //% blockId=KSR030_4WD_Motor_STOP
    //% block="All Motor STOP"
	//% weight=85
	
	export function Motor_4WD_STOP(): void {
		
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(14, 0, 0);
        setPwm(15, 0, 0);
        setPwm(0, 0, 0);
        setPwm(1, 0, 0);
        setPwm(3, 0, 0);
		setPwm(2, 0, 0);
        
            
    }
    


    //% blockId=KSR030_4WD_Mecanum_Car
    //% block="Mecanum_Car %index|Speed %speed"
    //% weight=87
    //% speed.min=0 speed.max=255
    export function Mecanum_Car(index: MecanumState, speed: number): void {
        switch (index) {
            case MecanumState.Forward: 
                Motor_4WD(MotorNum4WD.M1B,speed);
                Motor_4WD(MotorNum4WD.M1A,speed);
                Motor_4WD(MotorNum4WD.M2B,speed);
                Motor_4WD(MotorNum4WD.M2A,speed);
                break;
            case MecanumState.Back: 
                Motor_4WD(MotorNum4WD.M1B,-speed);
                Motor_4WD(MotorNum4WD.M1A,-speed);
                Motor_4WD(MotorNum4WD.M2B,-speed);
                Motor_4WD(MotorNum4WD.M2A,-speed);
                break;
            case MecanumState.Left: 
                Motor_4WD(MotorNum4WD.M1B,-speed);
                Motor_4WD(MotorNum4WD.M1A,speed);
                Motor_4WD(MotorNum4WD.M2B,speed);
                Motor_4WD(MotorNum4WD.M2A,-speed);
                break;
            case MecanumState.Right: 
                Motor_4WD(MotorNum4WD.M1B,speed);
                Motor_4WD(MotorNum4WD.M1A,-speed);
                Motor_4WD(MotorNum4WD.M2B,-speed);
                Motor_4WD(MotorNum4WD.M2A,speed);
                break;
            case MecanumState.Forward_Left: 
                Motor_4WD(MotorNum4WD.M1B,0);
                Motor_4WD(MotorNum4WD.M1A,speed);
                Motor_4WD(MotorNum4WD.M2B,speed);
                Motor_4WD(MotorNum4WD.M2A,0);
                break;
            case MecanumState.Forward_Right: 
                Motor_4WD(MotorNum4WD.M1B,speed);
                Motor_4WD(MotorNum4WD.M1A,0);
                Motor_4WD(MotorNum4WD.M2B,0);
                Motor_4WD(MotorNum4WD.M2A,speed); 
                break;
            case MecanumState.Back_Left: 
                Motor_4WD(MotorNum4WD.M1B,-speed);
                Motor_4WD(MotorNum4WD.M1A,0);
                Motor_4WD(MotorNum4WD.M2B,0);
                Motor_4WD(MotorNum4WD.M2A,-speed); 
                break;
            case MecanumState.Back_Right: 
                Motor_4WD(MotorNum4WD.M1B,0);
                Motor_4WD(MotorNum4WD.M1A,-speed);
                Motor_4WD(MotorNum4WD.M2B,-speed);
                Motor_4WD(MotorNum4WD.M2A,0);
                break;
            case MecanumState.Clockwise: 
                Motor_4WD(MotorNum4WD.M1B,speed);
                Motor_4WD(MotorNum4WD.M1A,-speed);
                Motor_4WD(MotorNum4WD.M2B,speed);
                Motor_4WD(MotorNum4WD.M2A,-speed); 
                break;
            case MecanumState.Counterclockwise: 
                Motor_4WD(MotorNum4WD.M1B,-speed);
                Motor_4WD(MotorNum4WD.M1A,speed);
                Motor_4WD(MotorNum4WD.M2B,-speed);
                Motor_4WD(MotorNum4WD.M2A,speed);
                break;
            case MecanumState.Stop: 
                Motor_4WD(MotorNum4WD.M1B,0);
                Motor_4WD(MotorNum4WD.M1A,0);
                Motor_4WD(MotorNum4WD.M2B,0);
                Motor_4WD(MotorNum4WD.M2A,0);
                break;
            
        }
    }
 


}
	
	



