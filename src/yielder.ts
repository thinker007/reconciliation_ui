function time() {
    return new Date().valueOf();
}

/** @constructor */
class Yielder {
  private startTime = time();
  private isCancelled = false;
  private nextAction = null;
  shouldYield(continueFunction) {
    if (this.isCancelled)
      return true;
    if (time() <= this.startTime + 10)
      return false;

    // info("yielding to UI thread");
    this.startTime = time();
    this.nextAction = addTimeout(continueFunction, 10);
    return true;
  }

  cancel() {
    if (this.nextAction)
      clearTimeout(this.nextAction);
    this.isCancelled = true;
  }
}


function politeEach<T>(array: T[], f:(i:number, val:T)=>any,
                       onComplete?:()=>any, yielder?:Yielder) {
  yielder = yielder || new Yielder();
  var index = 0;
  function iterate() {
    while(index < array.length) {
      f(index, array[index]);
      index++;
      if (yielder.shouldYield(iterate))
        return;
      }
      if (onComplete) onComplete();
    }
  iterate();
}

/** @param {!Array} array
    @param {!function(*)} f
    @param {!function(!Array)} onComplete
    @param {Yielder=} yielder
*/
function politeMap<T,V>(array: T[], f:(val:T)=>V,
                   onComplete:(mapped:V[])=>any,
                   yielder?:Yielder) {
  yielder = yielder || new Yielder();
  var result = [];
  politeEach(array, function(index, value) {
    result[index] = f(value);
  }, function() {onComplete(result);}, yielder);
}
