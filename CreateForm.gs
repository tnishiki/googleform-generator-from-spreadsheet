const SurveyTypes = ["CB","RB","SC","TX","PT","END"]

function createForm() {
  var form = FormApp.openById('Your Form Id')
  var file = SpreadsheetApp.openById('Your Spreadsheet Id')
  var sheet = file.getSheetByName("質問項目")

  var surveyValues = sheet.getDataRange().getValues()
  const validationEmail = FormApp.createTextValidation().requireTextIsEmail().build();
  const validationPhoneNumber = FormApp.createTextValidation()
    .setHelpText('ハイフンなし、半角数字で入力してください')
    .requireNumber().build();

  try{
    //タイトル
    var title = surveyValues[0][2]
    form.setTitle(title)
    //説明
    //var desc = surveyValues[1][2]
    //form.setDescription(desc)
  }
  catch(e){
    Logger.log(e.message)
  }

  var readLine = 0
  var contentCount = 1
  var qtype = ""//問題種類
  var qnum = 0 //問題数
  var choices = []
  var currentItem = null

  surveyValues.forEach((line)=>{
    if(2 < readLine){
      var col1 = surveyValues[readLine][0]
      var col2 = surveyValues[readLine][1]
      var col3 = surveyValues[readLine][2]
      var col4 = surveyValues[readLine][3]
      var col5 = surveyValues[readLine][4] // その他オプション
      var x = SurveyTypes.find(elm => elm == col1)

      if(x !== undefined){
        //これまでの質問項目を反映させる
        if(qtype!=""){
          switch(qtype){
            case "CB":
              currentItem.setChoices(choices)
              break
            case "RB":
              currentItem.setChoices(choices)
              break
          }
          contentCount+=1
        }

        //問題の種類を取得
        qtype = x

        if(form.getItems().length<contentCount){
          //新規作成
          switch(qtype){
            case "CB":
              currentItem = form.addCheckboxItem()
              .setTitle(col3)
              .setHelpText(col4)
              .showOtherOption((col5!="") ? true : false)
              .setRequired((col2!="")?true:false)
              choices = []
              break
            case "RB":
              currentItem = form.addMultipleChoiceItem()
              .setTitle(col3)
              .setHelpText(col4)
              .showOtherOption((col5!="") ? true : false)
              .setRequired((col2!="")?true:false)
              choices = []
              break
            case "TX":
              currentItem = form.addTextItem()
              .setTitle(col3)
              .setHelpText(col4)
              .setRequired((col2!="")?true:false)
              if(col5=="メール"){
                currentItem.setValidation(validationEmail);
              }
              else if(col5=="電話"){
                currentItem.setValidation(validationPhoneNumber);
              }
              break
            case "PT":
              currentItem = form.addParagraphTextItem()
                .setRequired((col2!="")?true:false)
                .setTitle(col3)
                .setHelpText(col4)
              break
            case "SC":
              currentItem = form.addPageBreakItem()
              .setTitle(col3)
              .setHelpText(col4)
              break
          }
        }
        else{
          //更新
          switch(qtype){
            case "CB":
              currentItem = form.getItems()[contentCount - 1].asCheckboxItem()
                .showOtherOption((col5!="") ? true : false)
                .setRequired((col2!="")?true:false)
                .setTitle(col3)
                .setHelpText(col4)
              choices = []
              break
            case "RB":
              currentItem = form.getItems()[contentCount - 1].asMultipleChoiceItem()
                .showOtherOption((col5!="") ? true : false)
                .setRequired((col2!="")?true:false)
                .setTitle(col3)
                .setHelpText(col4)
              choices = []
              break
            case "TX":
              currentItem = form.getItems()[contentCount - 1].asTextItem()
                .setRequired((col2!="")?true:false)
                .setTitle(col3)
                .setHelpText(col4)
              if(col5=="メール"){
                currentItem.setValidation(validationEmail);
              }
              else if(col5=="電話"){
                currentItem.setValidation(validationPhoneNumber);
              }
              break
            case "PT":
              currentItem = form.getItems()[contentCount - 1].asParagraphTextItem()
                .setRequired((col2!="")?true:false)
                .setTitle(col3)
                .setHelpText(col4)
              break
            case "SC":
              currentItem = form.getItems()[contentCount - 1].asPageBreakItem()
              break
          }
        }
      }
      else{
        //質問文
        var str = col3.trim()

        if(col2=="" && str!=""){
          switch(qtype){
            case "CB":
              choices.push(currentItem.createChoice(str))
              break
            case "RB":
              choices.push(currentItem.createChoice(str))
              break
          }
        }
      }
    }
    readLine++;
  });
}