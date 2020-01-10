import moment from "moment";
export const checkTime = (value) => {

  return moment(value).format("YYYY-MM-DD");

}
