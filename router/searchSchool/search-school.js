const request = require("request");
const neisInfo = require("../../config/neisInfo");
const colorConsole = require("../../lib/console");

module.exports = async (req, res) => {
    const key = neisInfo.key;
    const school_name = req.query.school_name;
    const url = `http://open.neis.go.kr/hub/schoolInfo?SCHUL_NM=${encodeURI(school_name)}&Type=json&KEY=${key}&pSize=800`;
    let schoolList;
    await request(url, (err, response, schoolInfo) => {
        try {
            if (err) {
                colorConsole.red("학교 조회중 오류가 발생하였습니다 school_name : " + school_name);
                return res.status(500).json({status : 500, message : "학교 조회중 오류가 발생하였습니다"});
            }
            
            schoolInfo = JSON.parse(schoolInfo);
            
            if(schoolInfo.RESULT != undefined) {
                if (schoolInfo.RESULT.CODE === "INFO-200") { //학교 정보가 없을경우 false반환
                    colorConsole.yellow("학교에 대한 정보가 없습니다 school_name : " + school_name);
                    return res.status(404).json({status : 404, message : "학교에 대한 정보가 없습니다"});
                }
            }
            
            const listCount = schoolInfo.schoolInfo[0].head[0].list_total_count; //학교 개수
            const _schoolList = [];
            
            for (let i = 0; i < listCount; i++) {
                _schoolList[i] = {
                    school_name : schoolInfo.schoolInfo[1].row[i].SCHUL_NM,
                    school_locate : schoolInfo.schoolInfo[1].row[i].ORG_RDNMA,
                    office_code : schoolInfo.schoolInfo[1].row[i].ATPT_OFCDC_SC_CODE,
                    school_code : schoolInfo.schoolInfo[1].row[i].SD_SCHUL_CODE,
                    school_type : schoolInfo.schoolInfo[1].row[i].SCHUL_KND_SC_NM
                }
                
            }
        schoolList = _schoolList;
        } catch(err) {
            colorConsole.red("학교 조회중 오류가 발생하였습니다 school_name : " + school_name);
            return res.status(500).json({status : 500, message : "학교 조회중 오류가 발생하였습니다"});
        }
        colorConsole.green("학교 조회에 성공하였습니댜 school_name : " + school_name);
        return res.status(200).json({status : 200, message : "학교 조회에 성공하였습니다", data : { schoolList }});
    });
}