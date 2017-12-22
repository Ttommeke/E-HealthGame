import time
import serial

# configure the serial connections (the parameters differs on the device you are connecting to)
ser = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate=9600,
    parity=serial.PARITY_ODD,
    stopbits=serial.STOPBITS_TWO,
    bytesize=serial.SEVENBITS
)

ser.isOpen()

input=1
while 1 :
    # get keyboard input
        # Python 3 users
        # input = input(">> ")
    # send the character to the device
    # (note that I happend a \r\n carriage return and line feed to the characters - this is requested by my device)
    while True:
        ser.write('p')
        out = ''
        # let's wait one second before reading output (let's give device time to answer)
        time.sleep(0.02)
        while ser.inWaiting() > 0:
            out += ser.read(1)

        if out != '':
            print(">>" + out)
