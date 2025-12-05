✅下記のようにif else文の外側に処理がある場合はif elseの条件に関係なく必ず実行される

const handleOnKeyDown = (e) => {
  処理A    
  if (条件){
    処理1
  }else if (条件) {
    router.push(...)
  }
  処理B
}


✅例外
条件Aを満たした場合は早期returnで後続の処理が実行されないので
処理Bはif else文の外側に合っても実行されない

処理Aは if (条件A)より上に書いてあるので実行される

const handleOnKeyDown = (e) => {
  処理A    
  if (条件A){
    処理1　return
  }if (条件B) {
    router.push(...)
  }
  処理B
}


注意）早期returnがある場合は後続のif文に対してelseをつけなくていい
早期returnが無い場合は後続のif文に対してelseをつける