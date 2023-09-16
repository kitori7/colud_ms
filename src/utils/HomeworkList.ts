import type { IQuestion } from "@/view/useHomework.vue";
export function questionOptionToIsAnswer(list: IQuestion[]) {
  list.forEach((item) => {
    if (item.questionType === "1") {
      const answerArr: number[] = [];
      item.homeworkQuestionOptions.forEach((option, optionIndex) => {
        if (option.isAnswer === "1") {
          answerArr.push(optionIndex);
        }
      });
      answerArr.sort((a, b) => Number(a) - Number(b));
      item.answer = answerArr;
    } else {
      item.homeworkQuestionOptions.forEach((option, optionIndex) => {
        if (option.isAnswer === "1") {
          item.answer = optionIndex;
        }
      });
    }
  });
  return list;
}

export function IsAnswerToQuestionOption(list: IQuestion[]) {
  list.forEach((item) => {
    item.homeworkQuestionOptions.forEach((item) => (item.isAnswer = "0"));
    if (item.questionType === "1") {
      if (item.answer instanceof Array) {
        item.answer.forEach((answer) => {
          let numberAnswer = Number(answer);
          item.homeworkQuestionOptions[numberAnswer].isAnswer = "1";
        });
      }
    } else {
      if (typeof item.answer === "number") {
        item.homeworkQuestionOptions[item.answer].isAnswer = "1";
      }
    }
  });
}
