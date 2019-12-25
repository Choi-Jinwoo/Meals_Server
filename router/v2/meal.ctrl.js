const moment = require('moment');
require('dotenv').config();
const axios = require('axios');
const colorConsole = require('../../lib/console');
const neisInfo = require('../../config/neisInfo');

/**
 * @description 급식 조회(어제, 오늘, 내일)
 */
exports.getMeals = async (req, res) => {
  const schoolId = req.query.school_id;
  const officeId = req.query.office_id;
  const { key } = neisInfo;

  const yesterday = moment().add(-1, 'days').format('YYYYMMDD');
  const today = moment().format('YYYYMMDD');
  const tomorrow = moment().add(+1, 'days').format('YYYYMMDD');

  if (!schoolId || !officeId) {
    colorConsole.yellow('검증 오류입니다.');
    return res.status(400).json({
      status: 400,
      message: '검증 오류입니다.',
    });
  }

  // 급식 조회
  const mealRes = await axios.get('http://open.neis.go.kr/hub/mealServiceDietInfo', {
    params: {
      KEY: key,
      Type: 'json',
      MLSV_FROM_YMD: yesterday,
      MLSV_TO_YMD: tomorrow,
      ATPT_OFCDC_SC_CODE: officeId,
      SD_SCHUL_CODE: schoolId
    }
  });

  if (mealRes.data.RESULT) { // Null Pointer Exception 보호 코드
    // 정상적으로 처리되지 않았을 경우 404 반환
    if ((mealRes.data.RESULT !== 'INFO-000')) {
      return res.status(404).json({
        status: 404,
        message: '급식 정보가 존재하지 않습니다.',
      })
    }
  }

  yesterdayMeal = [];
  todayMeal = [];
  tomorrowMeal = [];

  const mealData = mealRes.data.mealServiceDietInfo[1].row;
  // 급식을 요일, 순서에 맞게 삽입
  for (let i = 0; i < mealData.length; i++) {

    // 급식 순서(조식, 중식, 석식)
    let mealNum;
    try {
      mealNum = parseInt(mealData[i].MMEAL_SC_CODE) - 1
    } catch (err) {
      colorConsole.red(`급식 순서 확인중 서버 오류입니다.\n${err}`);
      return res.status(500).json({
        status: 500,
        message: '서버 오류입니다.',
      });
    }

    if (mealData[i].MLSV_YMD === yesterday) {
      yesterdayMeal[mealNum] = mealData[i].DDISH_NM;
    } else if (mealData[i].MLSV_YMD === today) {
      todayMeal[mealNum] = mealData[i].DDISH_NM;
    } else if (mealData[i].MLSV_YMD === tomorrow) {
      tomorrowMeal[mealNum] = mealData[i].DDISH_NM;
    }
  }

  // 급식이 없는곳 ''로 초기화
  for (let i = 0; i < 3; i++) {
    if (!yesterdayMeal[i]) {
      yesterdayMeal[i] = null;
    }

    if (!todayMeal[i]) {
      todayMeal[i] = null;
    }

    if (!tomorrowMeal[i]) {
      tomorrowMeal[i] = null;
    }
  }

  return res.status(200).json({
    status: 200,
    message: '급식 조회에 성공하였습니다.',
    data: {
      yesterday: yesterdayMeal,
      today: todayMeal,
      tomorrow: tomorrowMeal,
    }
  });
}