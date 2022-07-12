//formats date to "YYYY-MM-DD" so I can use in momentjs
const formatDate = (originalDate) => {
  let dueDateArray;

  if (originalDate.includes("/")) {
    dueDateArray = originalDate.split("/");
  } else {
    dueDateArray = originalDate.split("-");
  }

  const [month, date, year] = dueDateArray;

  const newDateString = `${year}-${month}-${date}`;

  return newDateString;
};

module.exports = formatDate;
