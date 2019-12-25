require('dotenv').config();
const request = require('request');
const axios = require('axios');
const colorConsole = require('../../lib/console');
const neisInfo = require('../../config/neisInfo');

module.exports = async (req, res) => {
  const { key } = neisInfo;
  const { school_name } = req.query;

  if (!school_name) {
    return res.status(400).json({
      status: 400,
      message: '검증 오류입니다.',
    })
  }

  const schoolRes = await axios.get('http://open.neis.go.kr/hub/schoolInfo', {
    params: {
      KEY: key,
      Type: 'json',
      SCHUL_NM: school_name,
      pSize: 800,
    }
  });

  const schoolList = [];

  if (schoolRes.data.RESULT) { // Null Pointer Exception 보호 코드
    // 정상적으로 처리되지 않았을 경우 404 반환
    if (schoolRes.data.RESULT.CODE !== 'INFO-000') {
      return res.status(404).json({
        status: 404,
        message: '학교 정보가 존재하지 않습니다.',
      })
    }
  }
  const data = schoolRes.data.schoolInfo;
  const listCount = data[0].head[0].list_total_count; //학교 개수

  for (let i = 0; i < listCount; i++) {
    schoolList[i] = {
      school_name: data[1].row[i].SCHUL_NM,
      school_locate: data[1].row[i].ORG_RDNMA,
      office_code: data[1].row[i].ATPT_OFCDC_SC_CODE,
      school_code: data[1].row[i].SD_SCHUL_CODE,
      school_type: data[1].row[i].SCHUL_KND_SC_NM

    };
  }

  colorConsole.green('학교 조회에 성공하였습니댜 school_name : ' + school_name);
  return res.status(200).json({
    status: 200,
    message: '학교 조회에 성공하였습니다',
    data: {
      schoolList
    },
  });
}
