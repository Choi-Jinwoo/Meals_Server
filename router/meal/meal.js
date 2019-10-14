const request = require("request");
const neisInfo = require("../../config/neisInfo");
const colorConsole = require("../../lib/console");
const getToday = require("./getDate");
const formatDate = require("./formatDate");
const removeSpecialChar = require("./removeSpecialChar");

module.exports = async (req, res) => {
    const school_id = req.query.school_id;
    const office_id = req.query.office_id;
    const key = neisInfo.key;

    let date = new Date();

    date = `${date.getFullYear()}${formatDate(date.getMonth() + 1)}${formatDate(date.getDate())}`;

    const url = `http://open.neis.go.kr/hub/mealServiceDietInfo?MLSV_YMD=${date}&ATPT_OFCDC_SC_CODE=${office_id}&SD_SCHUL_CODE=${school_id}&Type=json&KEY=${key}`;
    console.log(url);
    try {
        await request(url, (err, response, mealInfo) => {
            if (err) {
                colorConsole.red("급식조회중 오류가 발생하였습니다\n" + err);
                return res.status(500).json({ status: 500, message: "급식 조회중 오류가 발생하였습니다" });
            }

            mealInfo = JSON.parse(mealInfo);

            if (mealInfo.RESULT != undefined) {
                if (mealInfo.RESULT.CODE === "INFO-200") { //학교 정보가 없을경우 false반환
                    colorConsole.yellow("급식 대한 정보가 없습니다 school_id : " + school_id);
                    return res.status(404).json({ status: 404, message: "급식 대한 정보가 없습니다" });
                }
            }
            // MEAL_SC_CODE 조식, 중식, 석식 구분
            // DDISH_NM 내용

            mealInfo = mealInfo.mealServiceDietInfo[1].row;

            let breakfastList = {};
            let lunchList = {};
            let dinnerList = {};

            for (let i = 0; i < mealInfo.length; i++) {
                if (mealInfo[i].MMEAL_SC_CODE === "1") {
                    breakfastList = mealInfo[i].DDISH_NM;
                } else if (mealInfo[i].MMEAL_SC_CODE === "2") {
                    lunchList = mealInfo[i].DDISH_NM;
                } else if (mealInfo[i].MMEAL_SC_CODE === "3") {
                    dinnerList = mealInfo[i].DDISH_NM;
                }
            }

            if (!Object.keys(breakfastList).length) {
                breakfastList = null;
            }
            if (!Object.keys(lunchList).length) {
                lunchList = null;
            }
            if (!Object.keys(dinnerList).length) {
                dinnerList = null;
            }
            const meals = { breakfastList, lunchList, dinnerList };
            colorConsole.green("급식정보를 조회하였습니다 school_id : " + school_id);
            return res.status(200).json({ status: 200, message: "급식정보를 조회하였습니다", data: { meals } });
        })
    } catch (err) {
        colorConsole.red("급식정보 조회중 오류가 발생하였습니다\n" + err);
        return res.status(500).json({ status: 500, message: "급식정보 조회중 오류가 발생하였습니다" });
    }
}