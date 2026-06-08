import { handleCutZero } from '@/utils/tools';
import type { Page6_1ParameterItem, ProcessListItem } from './models';

export function runProcessCalculation(
  parameterTempList: Page6_1ParameterItem[],
  processList: ProcessListItem[],
  zldyxlPrm: string | number,
) {
  //鍔熺巼鍜?
  let data = parameterTempList[0]?.tableMap?.rowData ?? [];
  //浜ゆ祦鐢ㄧ數閲?
  let process1 = 0;
  let process2 = 0;
  let process3 = 0;
  let process4 = 0;
  let process5 = 0;
  let process6 = 0;
  let process7 = 0;
  let process8 = 0;
  let process9 = 0;
  let process10 = 0;
  let process11 = 0;
  let process12 = 0;
  let process13 = 0;
  let process14 = 0;
  let process15 = 0;
  let process16 = 0;
  let process17 = 0;
  let process18 = 0;
  let process19 = 0;
  let process20 = 0;
  //浣庡帇鐩存祦鐢ㄧ數閲?
  let directCurrent1 = 0;
  let directCurrent2 = 0;
  let directCurrent3 = 0;
  let directCurrent4 = 0;
  let directCurrent5 = 0;
  let directCurrent6 = 0;
  let directCurrent7 = 0;
  let directCurrent8 = 0;
  let directCurrent9 = 0;
  let directCurrent10 = 0;
  let directCurrent11 = 0;
  let directCurrent12 = 0;
  let directCurrent13 = 0;
  let directCurrent14 = 0;
  let directCurrent15 = 0;
  let directCurrent16 = 0;
  let directCurrent17 = 0;
  let directCurrent18 = 0;
  let directCurrent19 = 0;
  let directCurrent20 = 0;
  //楂樺帇鐩存祦鍔熺巼 AC power
  let ACpower1 = 0;
  let ACpower2 = 0;
  let ACpower3 = 0;
  let ACpower4 = 0;
  let ACpower5 = 0;
  let ACpower6 = 0;
  let ACpower7 = 0;
  let ACpower8 = 0;
  let ACpower9 = 0;
  let ACpower10 = 0;
  let ACpower11 = 0;
  let ACpower12 = 0;
  let ACpower13 = 0;
  let ACpower14 = 0;
  let ACpower15 = 0;
  let ACpower16 = 0;
  let ACpower17 = 0;
  let ACpower18 = 0;
  let ACpower19 = 0;
  let ACpower20 = 0;

  //浣庡帇鐩存祦鍔熺巼 AC power
  let DCpower1 = 0;
  let DCpower2 = 0;
  let DCpower3 = 0;
  let DCpower4 = 0;
  let DCpower5 = 0;
  let DCpower6 = 0;
  let DCpower7 = 0;
  let DCpower8 = 0;
  let DCpower9 = 0;
  let DCpower10 = 0;
  let DCpower11 = 0;
  let DCpower12 = 0;
  let DCpower13 = 0;
  let DCpower14 = 0;
  let DCpower15 = 0;
  let DCpower16 = 0;
  let DCpower17 = 0;
  let DCpower18 = 0;
  let DCpower19 = 0;
  let DCpower20 = 0;

  // 浣庡帇鐩存祦姣嶇嚎鐢ㄧ數閲?
  let powerLowVoltageDCbus1 = 0;
  let powerLowVoltageDCbus2 = 0;
  let powerLowVoltageDCbus3 = 0;
  let powerLowVoltageDCbus4 = 0;
  let powerLowVoltageDCbus5 = 0;
  let powerLowVoltageDCbus6 = 0;
  let powerLowVoltageDCbus7 = 0;
  let powerLowVoltageDCbus8 = 0;
  let powerLowVoltageDCbus9 = 0;
  let powerLowVoltageDCbus10 = 0;
  let powerLowVoltageDCbus11 = 0;
  let powerLowVoltageDCbus12 = 0;
  let powerLowVoltageDCbus13 = 0;
  let powerLowVoltageDCbus14 = 0;
  let powerLowVoltageDCbus15 = 0;
  let powerLowVoltageDCbus16 = 0;
  let powerLowVoltageDCbus17 = 0;
  let powerLowVoltageDCbus18 = 0;
  let powerLowVoltageDCbus19 = 0;
  let powerLowVoltageDCbus20 = 0;

  let time1 = 0;
  let time2 = 0;
  let time3 = 0;
  let time4 = 0;
  let time5 = 0;
  let time6 = 0;
  let time7 = 0;
  let time8 = 0;
  let time9 = 0;
  let time10 = 0;
  let time11 = 0;
  let time12 = 0;
  let time13 = 0;
  let time14 = 0;
  let time15 = 0;
  let time16 = 0;
  let time17 = 0;
  let time18 = 0;
  let time19 = 0;
  let time20 = 0;
  //浜ゆ祦鐢ㄧ數閲?
  let val1 = 0;
  let val2 = 0;
  let val3 = 0;
  let val4 = 0;
  let val5 = 0;
  let val6 = 0;
  let val7 = 0;
  let val8 = 0;
  let val9 = 0;
  let val10 = 0;
  let val11 = 0;
  let val12 = 0;
  let val13 = 0;
  let val14 = 0;
  let val15 = 0;
  let val16 = 0;
  let val17 = 0;
  let val18 = 0;
  let val19 = 0;
  let val20 = 0;
  //浣庡帇鐩存祦鐢ㄧ數閲?
  let directVal1 = 0;
  let directVal2 = 0;
  let directVal3 = 0;
  let directVal4 = 0;
  let directVal5 = 0;
  let directVal6 = 0;
  let directVal7 = 0;
  let directVal8 = 0;
  let directVal9 = 0;
  let directVal10 = 0;
  let directVal11 = 0;
  let directVal12 = 0;
  let directVal13 = 0;
  let directVal14 = 0;
  let directVal15 = 0;
  let directVal16 = 0;
  let directVal17 = 0;
  let directVal18 = 0;
  let directVal19 = 0;
  let directVal20 = 0;

  // 浣庡帇鐩存祦姣嶇嚎鐢ㄧ數閲?
  let powerLow1 = 0;
  let powerLow2 = 0;
  let powerLow3 = 0;
  let powerLow4 = 0;
  let powerLow5 = 0;
  let powerLow6 = 0;
  let powerLow7 = 0;
  let powerLow8 = 0;
  let powerLow9 = 0;
  let powerLow10 = 0;
  let powerLow11 = 0;
  let powerLow12 = 0;
  let powerLow13 = 0;
  let powerLow14 = 0;
  let powerLow15 = 0;
  let powerLow16 = 0;
  let powerLow17 = 0;
  let powerLow18 = 0;
  let powerLow19 = 0;
  let powerLow20 = 0;

  // 浣庡帇鐩存祦姣嶇嚎鐢ㄧ數鍔熺巼
  let powerDCbus1 = 0;
  let powerDCbus2 = 0;
  let powerDCbus3 = 0;
  let powerDCbus4 = 0;
  let powerDCbus5 = 0;
  let powerDCbus6 = 0;
  let powerDCbus7 = 0;
  let powerDCbus8 = 0;
  let powerDCbus9 = 0;
  let powerDCbus10 = 0;
  let powerDCbus11 = 0;
  let powerDCbus12 = 0;
  let powerDCbus13 = 0;
  let powerDCbus14 = 0;
  let powerDCbus15 = 0;
  let powerDCbus16 = 0;
  let powerDCbus17 = 0;
  let powerDCbus18 = 0;
  let powerDCbus19 = 0;
  let powerDCbus20 = 0;

  // 娴佺▼1鏍规嵁鐢ㄧ數璁惧鍒ゆ柇锛堟湁銆佹棤锛夋眰鍔熺巼鍜?
  let totalPower1 = 0;
  let totalPower2 = 0;
  let totalPower3 = 0;
  let totalPower4 = 0;
  let totalPower5 = 0;
  let totalPower6 = 0;
  let totalPower7 = 0;
  let totalPower8 = 0;
  let totalPower9 = 0;
  let totalPower10 = 0;
  let totalPower11 = 0;
  let totalPower12 = 0;
  let totalPower13 = 0;
  let totalPower14 = 0;
  let totalPower15 = 0;
  let totalPower16 = 0;
  let totalPower17 = 0;
  let totalPower18 = 0;
  let totalPower19 = 0;
  let totalPower20 = 0;

  //娴佺▼1鐢ㄧ數閲?=sum锛?鍔熺巼*鐢ㄧ數璁惧锛堟湁銆佹棤锛?灏忔椂锛?1000
  let totalElectricity1 = 0;
  let totalElectricity2 = 0;
  let totalElectricity3 = 0;
  let totalElectricity4 = 0;
  let totalElectricity5 = 0;
  let totalElectricity6 = 0;
  let totalElectricity7 = 0;
  let totalElectricity8 = 0;
  let totalElectricity9 = 0;
  let totalElectricity10 = 0;
  let totalElectricity11 = 0;
  let totalElectricity12 = 0;
  let totalElectricity13 = 0;
  let totalElectricity14 = 0;
  let totalElectricity15 = 0;
  let totalElectricity16 = 0;
  let totalElectricity17 = 0;
  let totalElectricity18 = 0;
  let totalElectricity19 = 0;
  let totalElectricity20 = 0;

  //浜ゆ祦杈撳叆鐢ㄧ數閲?
  let ACInput1 = 0;
  let ACInput2 = 0;
  let ACInput3 = 0;
  let ACInput4 = 0;
  let ACInput5 = 0;
  let ACInput6 = 0;
  let ACInput7 = 0;
  let ACInput8 = 0;
  let ACInput9 = 0;
  let ACInput10 = 0;
  let ACInput11 = 0;
  let ACInput12 = 0;
  let ACInput13 = 0;
  let ACInput14 = 0;
  let ACInput15 = 0;
  let ACInput16 = 0;
  let ACInput17 = 0;
  let ACInput18 = 0;
  let ACInput19 = 0;
  let ACInput20 = 0;

  //浜ゆ祦杈撳叆鍔熺巼
  let ACInputPower1 = 0;
  let ACInputPower2 = 0;
  let ACInputPower3 = 0;
  let ACInputPower4 = 0;
  let ACInputPower5 = 0;
  let ACInputPower6 = 0;
  let ACInputPower7 = 0;
  let ACInputPower8 = 0;
  let ACInputPower9 = 0;
  let ACInputPower10 = 0;
  let ACInputPower11 = 0;
  let ACInputPower12 = 0;
  let ACInputPower13 = 0;
  let ACInputPower14 = 0;
  let ACInputPower15 = 0;
  let ACInputPower16 = 0;
  let ACInputPower17 = 0;
  let ACInputPower18 = 0;
  let ACInputPower19 = 0;
  let ACInputPower20 = 0;

  data.forEach((item, index) => {
    if (index === 0) {
      time1 = item.p10;
      time2 = item.p12;
      time3 = item.p14;
      time4 = item.p16;
      time5 = item.p18;
      time6 = item.p20;
      time7 = item.p22;
      time8 = item.p24;
      time9 = item.p26;
      time10 = item.p28;
      time11 = item.p30;
      time12 = item.p32;
      time13 = item.p34;
      time14 = item.p36;
      time15 = item.p38;
      time16 = item.p40;
      time17 = item.p42;
      time18 = item.p44;
      time19 = item.p46;
      time20 = item.p48;
    }

    if (item.p0 == '楂樺帇鐩存祦') {
      if (item.p9 != undefined && item.p9 != '' && item.p9 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val1 = val1 + Number(item.p4) * Number(time1);
        ACpower1 = ACpower1 + Number(item.p4);
      }

      if (item.p11 != undefined && item.p11 != '' && item.p11 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val2 = val2 + Number(item.p4) * Number(time2);
        ACpower2 = ACpower2 + Number(item.p4);
      }

      if (item.p13 != undefined && item.p13 != '' && item.p13 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val3 = val3 + Number(item.p4) * Number(time3);
        ACpower3 = ACpower3 + Number(item.p4);
      }

      if (item.p15 != undefined && item.p15 != '' && item.p15 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val4 = val4 + Number(item.p4) * Number(time4);
        ACpower4 = ACpower4 + Number(item.p4);
      }

      if (item.p17 != undefined && item.p17 != '' && item.p17 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val5 = val5 + Number(item.p4) * Number(time5);
        ACpower5 = ACpower5 + Number(item.p4);
      }

      if (item.p19 != undefined && item.p19 != '' && item.p19 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val6 = val6 + Number(item.p4) * Number(time6);
        ACpower6 = ACpower6 + Number(item.p4);
      }

      if (item.p21 != undefined && item.p21 != '' && item.p21 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val7 = val7 + Number(item.p4) * Number(time7);
        ACpower7 = ACpower7 + Number(item.p4);
      }

      if (item.p23 != undefined && item.p23 != '' && item.p23 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val8 = val8 + Number(item.p4) * Number(time8);
        ACpower8 = ACpower8 + Number(item.p4);
      }

      if (item.p25 != undefined && item.p25 != '' && item.p25 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val9 = val9 + Number(item.p4) * Number(time9);
        ACpower9 = ACpower9 + Number(item.p4);
      }

      if (item.p27 != undefined && item.p27 != '' && item.p27 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val10 = val10 + Number(item.p4) * Number(time10);
        ACpower10 = ACpower10 + Number(item.p4);
      }

      if (item.p29 != undefined && item.p29 != '' && item.p29 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val11 = val11 + Number(item.p4) * Number(time11);
        ACpower11 = ACpower11 + Number(item.p4);
      }

      if (item.p31 != undefined && item.p31 != '' && item.p31 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val12 = val12 + Number(item.p4) * Number(time12);
        ACpower12 = ACpower12 + Number(item.p4);
      }

      if (item.p33 != undefined && item.p33 != '' && item.p33 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val13 = val13 + Number(item.p4) * Number(time13);
        ACpower13 = ACpower13 + Number(item.p4);
      }

      if (item.p35 != undefined && item.p35 != '' && item.p35 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val14 = val14 + Number(item.p4) * Number(time14);
        ACpower14 = ACpower14 + Number(item.p4);
      }

      if (item.p37 != undefined && item.p37 != '' && item.p37 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val15 = val15 + Number(item.p4) * Number(time15);
        ACpower15 = ACpower15 + Number(item.p4);
      }

      if (item.p39 != undefined && item.p39 != '' && item.p39 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val16 = val16 + Number(item.p4) * Number(time16);
        ACpower16 = ACpower16 + Number(item.p4);
      }

      if (item.p41 != undefined && item.p41 != '' && item.p41 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val17 = val17 + Number(item.p4) * Number(time17);
        ACpower17 = ACpower17 + Number(item.p4);
      }

      if (item.p43 != undefined && item.p43 != '' && item.p43 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val18 = val18 + Number(item.p4) * Number(time18);
        ACpower18 = ACpower18 + Number(item.p4);
      }

      if (item.p45 != undefined && item.p45 != '' && item.p45 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val19 = val19 + Number(item.p4) * Number(time19);
        ACpower19 = ACpower19 + Number(item.p4);
      }

      if (item.p47 != undefined && item.p47 != '' && item.p47 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        val20 = val20 + Number(item.p4) * Number(time20);
        ACpower20 = ACpower20 + Number(item.p4);
      }
    }

    if (item.p0 == '浣庡帇鐩存祦') {
      if (item.p9 != undefined && item.p9 != '' && item.p9 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal1 = directVal1 + Number(item.p4) * Number(time1);
        powerLow1 = powerLow1 + (Number(item.p4) / Number(item.p8)) * Number(time1);
        powerDCbus1 = powerDCbus1 + Number(item.p4) / Number(item.p8);
        DCpower1 = DCpower1 + Number(item.p4);
        // ACInput1 = ACInput1 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower1 =  ACInputPower1 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p11 != undefined && item.p11 != '' && item.p11 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal2 = directVal2 + Number(item.p4) * Number(time2);
        powerLow2 = powerLow2 + (Number(item.p4) / Number(item.p8)) * Number(time2);
        powerDCbus2 = powerDCbus2 + Number(item.p4) / Number(item.p8);
        DCpower2 = DCpower2 + Number(item.p4);
        // ACInput2 = ACInput2 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower2 =  ACInputPower2 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p13 != undefined && item.p13 != '' && item.p13 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal3 = directVal3 + Number(item.p4) * Number(time3);
        powerLow3 = powerLow3 + (Number(item.p4) / Number(item.p8)) * Number(time3);
        powerDCbus3 = powerDCbus3 + Number(item.p4) / Number(item.p8);
        DCpower3 = DCpower3 + Number(item.p4);
        // ACInput3 = ACInput3 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower3 =  ACInputPower3 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p15 != undefined && item.p15 != '' && item.p15 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal4 = directVal4 + Number(item.p4) * Number(time4);
        powerLow4 = powerLow4 + (Number(item.p4) / Number(item.p8)) * Number(time4);
        powerDCbus4 = powerDCbus4 + Number(item.p4) / Number(item.p8);
        DCpower4 = DCpower4 + Number(item.p4);
        // ACInput4 = ACInput4 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower4 =  ACInputPower4 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p17 != undefined && item.p17 != '' && item.p17 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal5 = directVal5 + Number(item.p4) * Number(time5);
        powerLow5 = powerLow5 + (Number(item.p4) / Number(item.p8)) * Number(time5);
        powerDCbus5 = powerDCbus5 + Number(item.p4) / Number(item.p8);
        DCpower5 = DCpower5 + Number(item.p4);
        // ACInput5 = ACInput5 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower5 =  ACInputPower5 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p19 != undefined && item.p19 != '' && item.p19 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal6 = directVal6 + Number(item.p4) * Number(time6);
        powerLow6 = powerLow6 + (Number(item.p4) / Number(item.p8)) * Number(time6);
        powerDCbus6 = powerDCbus6 + Number(item.p4) / Number(item.p8);
        DCpower6 = DCpower6 + Number(item.p4);
        // ACInput6 = ACInput6 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower6 =  ACInputPower6 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p21 != undefined && item.p21 != '' && item.p21 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal7 = directVal7 + Number(item.p4) * Number(time7);
        powerLow7 = powerLow7 + (Number(item.p4) / Number(item.p8)) * Number(time7);
        powerDCbus7 = powerDCbus7 + Number(item.p4) / Number(item.p8);
        DCpower7 = DCpower7 + Number(item.p4);
        // ACInput7 = ACInput7 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower7 =  ACInputPower7 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p23 != undefined && item.p23 != '' && item.p23 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal8 = directVal8 + Number(item.p4) * Number(time8);
        powerLow8 = powerLow8 + (Number(item.p4) / Number(item.p8)) * Number(time8);
        powerDCbus8 = powerDCbus8 + Number(item.p4) / Number(item.p8);
        DCpower8 = DCpower8 + Number(item.p4);
        // ACInput8 = ACInput8 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower8 =  ACInputPower8 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p25 != undefined && item.p25 != '' && item.p25 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal9 = directVal9 + Number(item.p4) * Number(time9);
        powerLow9 = powerLow9 + (Number(item.p4) / Number(item.p8)) * Number(time9);
        powerDCbus9 = powerDCbus9 + Number(item.p4) / Number(item.p8);
        DCpower9 = DCpower9 + Number(item.p4);
        // ACInput9 = ACInput9 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower9 =  ACInputPower9 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p27 != undefined && item.p27 != '' && item.p27 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal10 = directVal10 + Number(item.p4) * Number(time10);
        powerLow10 = powerLow10 + (Number(item.p4) / Number(item.p8)) * Number(time10);
        powerDCbus10 = powerDCbus10 + Number(item.p4) / Number(item.p8);
        DCpower10 = DCpower10 + Number(item.p4);
        // ACInput10 = ACInput10 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower10 =  ACInputPower10 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p29 != undefined && item.p29 != '' && item.p29 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal11 = directVal11 + Number(item.p4) * Number(time11);
        powerLow11 = powerLow11 + (Number(item.p4) / Number(item.p8)) * Number(time11);
        powerDCbus11 = powerDCbus11 + Number(item.p4) / Number(item.p8);
        DCpower11 = DCpower11 + Number(item.p4);
        // ACInput11 = ACInput11 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower11 =  ACInputPower11 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p31 != undefined && item.p31 != '' && item.p31 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal12 = directVal12 + Number(item.p4) * Number(time12);
        powerLow12 = powerLow13 + (Number(item.p4) / Number(item.p8)) * Number(time12);
        powerDCbus12 = powerDCbus12 + Number(item.p4) / Number(item.p8);
        DCpower12 = DCpower12 + Number(item.p4);
        // ACInput12 = ACInput12 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower12 =  ACInputPower12 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p33 != undefined && item.p33 != '' && item.p33 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal13 = directVal13 + Number(item.p4) * Number(time13);
        powerLow13 = powerLow13 + (Number(item.p4) / Number(item.p8)) * Number(time13);
        powerDCbus13 = powerDCbus13 + Number(item.p4) / Number(item.p8);
        DCpower13 = DCpower13 + Number(item.p4);
        // ACInput13 = ACInput13 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower13 =  ACInputPower13 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p35 != undefined && item.p35 != '' && item.p35 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal14 = directVal14 + Number(item.p4) * Number(time14);
        powerLow14 = powerLow14 + (Number(item.p4) / Number(item.p8)) * Number(time14);
        powerDCbus14 = powerDCbus14 + Number(item.p4) / Number(item.p8);
        DCpower14 = DCpower14 + Number(item.p4);
        // ACInput14 = ACInput14 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower14 =  ACInputPower14 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p37 != undefined && item.p37 != '' && item.p37 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal15 = directVal15 + Number(item.p4) * Number(time15);
        powerLow15 = powerLow15 + (Number(item.p4) / Number(item.p8)) * Number(time15);
        powerDCbus15 = powerDCbus15 + Number(item.p4) / Number(item.p8);
        DCpower15 = DCpower15 + Number(item.p4);
        // ACInput15 = ACInput15 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower15 =  ACInputPower15 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p39 != undefined && item.p39 != '' && item.p39 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal16 = directVal16 + Number(item.p4) * Number(time16);
        powerLow16 = powerLow16 + (Number(item.p4) / Number(item.p8)) * Number(time16);
        powerDCbus16 = powerDCbus16 + Number(item.p4) / Number(item.p8);
        DCpower16 = DCpower16 + Number(item.p4);
        // ACInput16 = ACInput16 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower16 =  ACInputPower16 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p41 != undefined && item.p41 != '' && item.p41 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal17 = directVal17 + Number(item.p4) * Number(time17);
        powerLow17 = powerLow17 + (Number(item.p4) / Number(item.p8)) * Number(time17);
        powerDCbus17 = powerDCbus17 + Number(item.p4) / Number(item.p8);
        DCpower17 = DCpower17 + Number(item.p4);
        // ACInput17 = ACInput17 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower17 =  ACInputPower17 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p43 != undefined && item.p43 != '' && item.p43 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal18 = directVal18 + Number(item.p4) * Number(time18);
        powerLow18 = powerLow18 + (Number(item.p4) / Number(item.p8)) * Number(time18);
        powerDCbus18 = powerDCbus18 + Number(item.p4) / Number(item.p8);
        DCpower18 = DCpower18 + Number(item.p4);
        // ACInput18 = ACInput18 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower18 =  ACInputPower18 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p45 != undefined && item.p45 != '' && item.p45 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal19 = directVal19 + Number(item.p4) * Number(time19);
        powerLow19 = powerLow19 + (Number(item.p4) / Number(item.p8)) * Number(time19);
        powerDCbus19 = powerDCbus19 + Number(item.p4) / Number(item.p8);
        DCpower19 = DCpower19 + Number(item.p4);
        // ACInput19 = ACInput19 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower19 =  ACInputPower19 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }

      if (item.p47 != undefined && item.p47 != '' && item.p47 == 1) {
        //鍒ゆ柇鏄惁鍙傚姞璁＄畻
        directVal20 = directVal20 + Number(item.p4) * Number(time20);
        powerLow20 = powerLow20 + (Number(item.p4) / Number(item.p8)) * Number(time20);
        powerDCbus20 = powerDCbus20 + Number(item.p4) / Number(item.p8);
        DCpower20 = DCpower20 + Number(item.p4);
        // ACInput20 = ACInput20 + (Number(item.p4) * Number(time1))/(Number(item.p8) * Number(item.p9))
        // ACInputPower20 =  ACInputPower20 + Number(item.p4)/(Number(item.p8) * Number(item.p9))
      }
    }

    if (item.p9 != undefined && item.p9 != '' && item.p9 == 1) {
      totalPower1 = totalPower1 + Number(item.p4);
      totalElectricity1 = totalElectricity1 + Number(item.p4) * Number(time1);
    }

    if (item.p11 != undefined && item.p11 != '' && item.p11 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower2 = totalPower2 + Number(item.p4);
      totalElectricity2 = totalElectricity2 + Number(item.p4) * Number(time2);
    }

    if (item.p13 != undefined && item.p13 != '' && item.p13 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower3 = totalPower3 + Number(item.p4);
      totalElectricity3 = totalElectricity3 + Number(item.p4) * Number(time3);
    }

    if (item.p15 != undefined && item.p15 != '' && item.p15 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower4 = totalPower4 + Number(item.p4);
      totalElectricity4 = totalElectricity4 + Number(item.p4) * Number(time4);
    }

    if (item.p17 != undefined && item.p17 != '' && item.p17 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower5 = totalPower5 + Number(item.p4);
      totalElectricity5 = totalElectricity5 + Number(item.p4) * Number(time5);
    }

    if (item.p19 != undefined && item.p19 != '' && item.p19 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower6 = totalPower6 + Number(item.p4);
      totalElectricity6 = totalElectricity6 + Number(item.p4) * Number(time6);
    }

    if (item.p21 != undefined && item.p21 != '' && item.p21 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower7 = totalPower7 + Number(item.p4);
      totalElectricity7 = totalElectricity7 + Number(item.p4) * Number(time7);
    }

    if (item.p23 != undefined && item.p23 != '' && item.p23 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower8 = totalPower8 + Number(item.p4);
      totalElectricity8 = totalElectricity8 + Number(item.p4) * Number(time8);
    }

    if (item.p25 != undefined && item.p25 != '' && item.p25 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower9 = totalPower9 + Number(item.p4);
      totalElectricity9 = totalElectricity9 + Number(item.p4) * Number(time9);
    }

    if (item.p27 != undefined && item.p27 != '' && item.p27 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower10 = totalPower10 + Number(item.p4);
      totalElectricity10 = totalElectricity10 + Number(item.p4) * Number(time10);
    }

    if (item.p29 != undefined && item.p29 != '' && item.p29 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower11 = totalPower11 + Number(item.p4);
      totalElectricity11 = totalElectricity11 + Number(item.p4) * Number(time11);
    }

    if (item.p31 != undefined && item.p31 != '' && item.p31 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower12 = totalPower12 + Number(item.p4);
      totalElectricity12 = totalElectricity12 + Number(item.p4) * Number(time12);
    }

    if (item.p33 != undefined && item.p33 != '' && item.p33 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower13 = totalPower13 + Number(item.p4);
      totalElectricity13 = totalElectricity13 + Number(item.p4) * Number(time13);
    }

    if (item.p35 != undefined && item.p35 != '' && item.p35 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower14 = totalPower14 + Number(item.p4);
      totalElectricity14 = totalElectricity14 + Number(item.p4) * Number(time14);
    }

    if (item.p37 != undefined && item.p37 != '' && item.p37 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower15 = totalPower15 + Number(item.p4);
      totalElectricity15 = totalElectricity15 + Number(item.p4) * Number(time15);
    }

    if (item.p39 != undefined && item.p39 != '' && item.p39 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower16 = totalPower16 + Number(item.p4);
      totalElectricity16 = totalElectricity16 + Number(item.p4) * Number(time16);
    }

    if (item.p41 != undefined && item.p41 != '' && item.p41 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower17 = totalPower17 + Number(item.p4);
      totalElectricity17 = totalElectricity17 + Number(item.p4) * Number(time17);
    }

    if (item.p43 != undefined && item.p43 != '' && item.p43 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower18 = totalPower18 + Number(item.p4);
      totalElectricity18 = totalElectricity18 + Number(item.p4) * Number(time18);
    }

    if (item.p45 != undefined && item.p45 != '' && item.p45 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower19 = totalPower19 + Number(item.p4);
      totalElectricity19 = totalElectricity19 + Number(item.p4) * Number(time19);
    }

    if (item.p47 != undefined && item.p47 != '' && item.p47 == 1) {
      //鍒ゆ柇鏄惁鍙傚姞璁＄畻
      totalPower20 = totalPower20 + Number(item.p4);
      totalElectricity20 = totalElectricity20 + Number(item.p4) * Number(time20);
    }
  });

  process1 = val1 / 1000;
  process2 = val2 / 1000;
  process3 = val3 / 1000;
  process4 = val4 / 1000;
  process5 = val5 / 1000;
  process6 = val6 / 1000;
  process7 = val7 / 1000;
  process8 = val8 / 1000;
  process9 = val9 / 1000;
  process10 = val10 / 1000;
  process11 = val11 / 1000;
  process12 = val12 / 1000;
  process13 = val13 / 1000;
  process14 = val14 / 1000;
  process15 = val15 / 1000;
  process16 = val16 / 1000;
  process17 = val17 / 1000;
  process18 = val18 / 1000;
  process19 = val19 / 1000;
  process20 = val20 / 1000;

  directCurrent1 = directVal1 / 1000;
  directCurrent2 = directVal2 / 1000;
  directCurrent3 = directVal3 / 1000;
  directCurrent4 = directVal4 / 1000;
  directCurrent5 = directVal5 / 1000;
  directCurrent6 = directVal6 / 1000;
  directCurrent7 = directVal7 / 1000;
  directCurrent8 = directVal8 / 1000;
  directCurrent9 = directVal9 / 1000;
  directCurrent10 = directVal10 / 1000;
  directCurrent11 = directVal11 / 1000;
  directCurrent12 = directVal12 / 1000;
  directCurrent13 = directVal13 / 1000;
  directCurrent14 = directVal14 / 1000;
  directCurrent15 = directVal15 / 1000;
  directCurrent16 = directVal16 / 1000;
  directCurrent17 = directVal17 / 1000;
  directCurrent18 = directVal18 / 1000;
  directCurrent19 = directVal19 / 1000;
  directCurrent20 = directVal20 / 1000;

  powerLowVoltageDCbus1 = powerLow1 / 1000;
  powerLowVoltageDCbus2 = powerLow2 / 1000;
  powerLowVoltageDCbus3 = powerLow3 / 1000;
  powerLowVoltageDCbus4 = powerLow4 / 1000;
  powerLowVoltageDCbus5 = powerLow5 / 1000;
  powerLowVoltageDCbus6 = powerLow6 / 1000;
  powerLowVoltageDCbus7 = powerLow7 / 1000;
  powerLowVoltageDCbus8 = powerLow8 / 1000;
  powerLowVoltageDCbus9 = powerLow9 / 1000;
  powerLowVoltageDCbus10 = powerLow10 / 1000;
  powerLowVoltageDCbus11 = powerLow11 / 1000;
  powerLowVoltageDCbus12 = powerLow12 / 1000;
  powerLowVoltageDCbus13 = powerLow13 / 1000;
  powerLowVoltageDCbus14 = powerLow14 / 1000;
  powerLowVoltageDCbus15 = powerLow15 / 1000;
  powerLowVoltageDCbus16 = powerLow16 / 1000;
  powerLowVoltageDCbus17 = powerLow17 / 1000;
  powerLowVoltageDCbus18 = powerLow18 / 1000;
  powerLowVoltageDCbus19 = powerLow19 / 1000;
  powerLowVoltageDCbus20 = powerLow20 / 1000;

  totalElectricity1 = totalElectricity1 / 1000;
  totalElectricity2 = totalElectricity2 / 1000;
  totalElectricity3 = totalElectricity3 / 1000;
  totalElectricity4 = totalElectricity4 / 1000;
  totalElectricity5 = totalElectricity5 / 1000;
  totalElectricity6 = totalElectricity6 / 1000;
  totalElectricity7 = totalElectricity7 / 1000;
  totalElectricity8 = totalElectricity8 / 1000;
  totalElectricity9 = totalElectricity9 / 1000;
  totalElectricity10 = totalElectricity10 / 1000;
  totalElectricity11 = totalElectricity11 / 1000;
  totalElectricity12 = totalElectricity12 / 1000;
  totalElectricity13 = totalElectricity13 / 1000;
  totalElectricity14 = totalElectricity14 / 1000;
  totalElectricity15 = totalElectricity15 / 1000;
  totalElectricity16 = totalElectricity16 / 1000;
  totalElectricity17 = totalElectricity17 / 1000;
  totalElectricity18 = totalElectricity18 / 1000;
  totalElectricity19 = totalElectricity19 / 1000;
  totalElectricity20 = totalElectricity20 / 1000;

  ACInput1 = powerLowVoltageDCbus1 / zldyxlPrm;
  ACInput2 = powerLowVoltageDCbus2 / zldyxlPrm;
  ACInput3 = powerLowVoltageDCbus3 / zldyxlPrm;
  ACInput4 = powerLowVoltageDCbus4 / zldyxlPrm;
  ACInput5 = powerLowVoltageDCbus5 / zldyxlPrm;
  ACInput6 = powerLowVoltageDCbus6 / zldyxlPrm;
  ACInput7 = powerLowVoltageDCbus7 / zldyxlPrm;
  ACInput8 = powerLowVoltageDCbus5 / zldyxlPrm;
  ACInput9 = powerLowVoltageDCbus9 / zldyxlPrm;
  ACInput10 = powerLowVoltageDCbus10 / zldyxlPrm;
  ACInput11 = powerLowVoltageDCbus11 / zldyxlPrm;
  ACInput12 = powerLowVoltageDCbus12 / zldyxlPrm;
  ACInput13 = powerLowVoltageDCbus13 / zldyxlPrm;
  ACInput14 = powerLowVoltageDCbus14 / zldyxlPrm;
  ACInput15 = powerLowVoltageDCbus15 / zldyxlPrm;
  ACInput16 = powerLowVoltageDCbus16 / zldyxlPrm;
  ACInput17 = powerLowVoltageDCbus17 / zldyxlPrm;
  ACInput18 = powerLowVoltageDCbus18 / zldyxlPrm;
  ACInput19 = powerLowVoltageDCbus19 / zldyxlPrm;
  ACInput20 = powerLowVoltageDCbus20 / zldyxlPrm;

  ACInputPower1 = powerDCbus1 / zldyxlPrm;
  ACInputPower2 = powerDCbus2 / zldyxlPrm;
  ACInputPower3 = powerDCbus3 / zldyxlPrm;
  ACInputPower4 = powerDCbus4 / zldyxlPrm;
  ACInputPower5 = powerDCbus5 / zldyxlPrm;
  ACInputPower6 = powerDCbus6 / zldyxlPrm;
  ACInputPower7 = powerDCbus7 / zldyxlPrm;
  ACInputPower8 = powerDCbus8 / zldyxlPrm;
  ACInputPower9 = powerDCbus9 / zldyxlPrm;
  ACInputPower10 = powerDCbus10 / zldyxlPrm;
  ACInputPower11 = powerDCbus11 / zldyxlPrm;
  ACInputPower12 = powerDCbus12 / zldyxlPrm;
  ACInputPower13 = powerDCbus13 / zldyxlPrm;
  ACInputPower14 = powerDCbus14 / zldyxlPrm;
  ACInputPower15 = powerDCbus15 / zldyxlPrm;
  ACInputPower16 = powerDCbus16 / zldyxlPrm;
  ACInputPower17 = powerDCbus17 / zldyxlPrm;
  ACInputPower18 = powerDCbus18 / zldyxlPrm;
  ACInputPower19 = powerDCbus19 / zldyxlPrm;
  ACInputPower20 = powerDCbus20 / zldyxlPrm;

  powerDCbus1 = powerDCbus1 + ACpower1;
  powerDCbus2 = powerDCbus2 + ACpower2;
  powerDCbus3 = powerDCbus3 + ACpower3;
  powerDCbus4 = powerDCbus4 + ACpower4;
  powerDCbus5 = powerDCbus5 + ACpower5;
  powerDCbus6 = powerDCbus6 + ACpower6;
  powerDCbus7 = powerDCbus7 + ACpower7;
  powerDCbus8 = powerDCbus8 + ACpower8;
  powerDCbus9 = powerDCbus9 + ACpower9;
  powerDCbus10 = powerDCbus10 + ACpower10;
  powerDCbus11 = powerDCbus11 + ACpower11;
  powerDCbus12 = powerDCbus12 + ACpower12;
  powerDCbus13 = powerDCbus13 + ACpower13;
  powerDCbus14 = powerDCbus14 + ACpower14;
  powerDCbus15 = powerDCbus15 + ACpower15;
  powerDCbus16 = powerDCbus16 + ACpower16;
  powerDCbus17 = powerDCbus17 + ACpower17;
  powerDCbus18 = powerDCbus18 + ACpower18;
  powerDCbus19 = powerDCbus19 + ACpower19;
  powerDCbus20 = powerDCbus20 + ACpower20;

  processList.forEach(item => {
    if (item.id == 1) {
      item.modeTypeVal0 = handleCutZero(process1.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent1.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower1.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower1.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus1.toFixed(3)); // 浣庡帇鐩存祦姣嶇嚎鐢ㄧ數閲?
      item.modeTypeVal5 = handleCutZero(powerDCbus1.toFixed(3)); //浣庡帇鐩存祦姣嶇嚎鐢ㄧ數鍔熺巼
      item.modeTypeVal6 = handleCutZero(totalElectricity1.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower1.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput1.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower1.toFixed(3));
    }
    if (item.id == 2) {
      item.modeTypeVal0 = handleCutZero(process2.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent2.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower2.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower2.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus2.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus2.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity2.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower2.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput2.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower2.toFixed(3));
    }
    if (item.id == 3) {
      item.modeTypeVal0 = handleCutZero(process3.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent3.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower3.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower3.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus3.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus3.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity3.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower3.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput3.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower3.toFixed(3));
    }
    if (item.id == 4) {
      item.modeTypeVal0 = handleCutZero(process4.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent4.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower4.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower4.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus4.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus4.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity4.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower4.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput4.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower4.toFixed(3));
    }
    if (item.id == 5) {
      item.modeTypeVal0 = handleCutZero(process5.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent5.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower5.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower5.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus5.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus5.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity5.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower5.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput5.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower5.toFixed(3));
    }
    if (item.id == 6) {
      item.modeTypeVal0 = handleCutZero(process6.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent6.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower6.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower6.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus6.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus6.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity6.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower6.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput6.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower6.toFixed(3));
    }
    if (item.id == 7) {
      item.modeTypeVal0 = handleCutZero(process7.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent7.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower7.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower7.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus7.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus7.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity7.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower7.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput7.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower7.toFixed(3));
    }
    if (item.id == 8) {
      item.modeTypeVal0 = handleCutZero(process8.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent8.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower8.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower8.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus8.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus8.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity8.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower8.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput8.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower8.toFixed(3));
    }
    if (item.id == 9) {
      item.modeTypeVal0 = handleCutZero(process9.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent9.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower9.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower9.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus9.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus9.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity9.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower9.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput9.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower9.toFixed(3));
    }
    if (item.id == 10) {
      item.modeTypeVal0 = handleCutZero(process10.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent10.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower10.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower10.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus10.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus10.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity10.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower10.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput10.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower10.toFixed(3));
    }
    if (item.id == 11) {
      item.modeTypeVal0 = handleCutZero(process11.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent11.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower11.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower11.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus11.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus11.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity11.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower11.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput11.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower11.toFixed(3));
    }
    if (item.id == 12) {
      item.modeTypeVal0 = handleCutZero(process12.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent12.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower12.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower12.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus12.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus12.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity12.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower12.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput12.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower12.toFixed(3));
    }
    if (item.id == 13) {
      item.modeTypeVal0 = handleCutZero(process13.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent13.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower13.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower13.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus13.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus13.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity13.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower13.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput13.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower13.toFixed(3));
    }
    if (item.id == 14) {
      item.modeTypeVal0 = handleCutZero(process14.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent14.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower14.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower14.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus14.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus14.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity14.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower14.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput14.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower14.toFixed(3));
    }
    if (item.id == 15) {
      item.modeTypeVal0 = handleCutZero(process15.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent15.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower15.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower15.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus15.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus15.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity15.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower15.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput15.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower15.toFixed(3));
    }
    if (item.id == 16) {
      item.modeTypeVal0 = handleCutZero(process16.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent16.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower16.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower16.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus16.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus16.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity16.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower16.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput16.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower16.toFixed(3));
    }
    if (item.id == 17) {
      item.modeTypeVal0 = handleCutZero(process17.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent17.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower17.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower17.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus17.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus17.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity17.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower17.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput17.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower17.toFixed(3));
    }
    if (item.id == 18) {
      item.modeTypeVal0 = handleCutZero(process18.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent18.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower18.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower18.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus18.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus18.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity18.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower18.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput18.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower18.toFixed(3));
    }
    if (item.id == 19) {
      item.modeTypeVal0 = handleCutZero(process19.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent19.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower19.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower19.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus19.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus19.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity19.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower19.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput19.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower19.toFixed(3));
    }
    if (item.id == 20) {
      item.modeTypeVal0 = handleCutZero(process20.toFixed(3));
      item.modeTypeVal1 = handleCutZero(directCurrent20.toFixed(3));
      item.modeTypeVal2 = handleCutZero(ACpower20.toFixed(3));
      item.modeTypeVal3 = handleCutZero(DCpower20.toFixed(3));
      item.modeTypeVal4 = handleCutZero(powerLowVoltageDCbus20.toFixed(3));
      item.modeTypeVal5 = handleCutZero(powerDCbus20.toFixed(3));
      item.modeTypeVal6 = handleCutZero(totalElectricity20.toFixed(3));
      item.modeTypeVal7 = handleCutZero(totalPower20.toFixed(3));
      item.modeTypeVal8 = handleCutZero(ACInput20.toFixed(3));
      item.modeTypeVal9 = handleCutZero(ACInputPower20.toFixed(3));
    }
  });
  let sumElectricity =
    totalElectricity1 +
    totalElectricity2 +
    totalElectricity3 +
    totalElectricity4 +
    totalElectricity5 +
    totalElectricity6 +
    totalElectricity7 +
    totalElectricity8 +
    totalElectricity9 +
    totalElectricity10 +
    totalElectricity11 +
    totalElectricity12 +
    totalElectricity13 +
    totalElectricity14 +
    totalElectricity15 +
    totalElectricity16 +
    totalElectricity17 +
    totalElectricity18 +
    totalElectricity19 +
    totalElectricity20;
  parameterTempList[1].defaultValue = handleCutZero(sumElectricity.toFixed(3)); //鎬荤敤鐢甸噺

  let sumProcess =
    process1 +
    process2 +
    process3 +
    process4 +
    process5 +
    process6 +
    process7 +
    process8 +
    process9 +
    process10 +
    process11 +
    process12 +
    process13 +
    process14 +
    process15 +
    process16 +
    process17 +
    process18 +
    process19 +
    process20;
  parameterTempList[2].defaultValue = handleCutZero(sumProcess.toFixed(3)); //鎬讳氦娴佺敤鐢甸噺

  let sumDirectCurrent =
    directCurrent1 +
    directCurrent2 +
    directCurrent3 +
    directCurrent4 +
    directCurrent5 +
    directCurrent6 +
    directCurrent7 +
    directCurrent8 +
    directCurrent9 +
    directCurrent10 +
    directCurrent11 +
    directCurrent12 +
    directCurrent13 +
    directCurrent14 +
    directCurrent15 +
    directCurrent16 +
    directCurrent17 +
    directCurrent18 +
    directCurrent19 +
    directCurrent20;
  parameterTempList[3].defaultValue = handleCutZero(sumDirectCurrent.toFixed(3)); //鎬讳綆鍘嬬洿娴佺敤鐢甸噺

  let sumACInput =
    ACInput1 +
    ACInput2 +
    ACInput3 +
    ACInput4 +
    ACInput5 +
    ACInput6 +
    ACInput7 +
    ACInput8 +
    ACInput9 +
    ACInput10 +
    ACInput11 +
    ACInput12 +
    ACInput13 +
    ACInput14 +
    ACInput15 +
    ACInput16 +
    ACInput17 +
    ACInput18 +
    ACInput19 +
    ACInput20;
  parameterTempList[4].defaultValue = handleCutZero(sumACInput.toFixed(3)); //鎬讳氦娴佽緭鍏ョ敤鐢甸噺

  let sumPowerLowVoltageDCbus =
    powerLowVoltageDCbus1 +
    powerLowVoltageDCbus2 +
    powerLowVoltageDCbus3 +
    powerLowVoltageDCbus4 +
    powerLowVoltageDCbus5 +
    powerLowVoltageDCbus6 +
    powerLowVoltageDCbus7 +
    powerLowVoltageDCbus8 +
    powerLowVoltageDCbus9 +
    powerLowVoltageDCbus10 +
    powerLowVoltageDCbus11 +
    powerLowVoltageDCbus12 +
    powerLowVoltageDCbus13 +
    powerLowVoltageDCbus14 +
    powerLowVoltageDCbus15 +
    powerLowVoltageDCbus16 +
    powerLowVoltageDCbus17 +
    powerLowVoltageDCbus18 +
    powerLowVoltageDCbus19 +
    powerLowVoltageDCbus20;
  parameterTempList[5].defaultValue = handleCutZero(sumPowerLowVoltageDCbus.toFixed(3)); //鎬婚珮鍘嬬洿娴佹瘝绾跨敤鐢甸噺
}
