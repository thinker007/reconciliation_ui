/* Convenient functions for handling arrays */
module Arr {

  export function difference<T>(source:T[], toRemove:T[]):T[] {
      source = $.makeArray(source); toRemove = $.makeArray(toRemove);
      var result : T[] = [];
      $.each(source, function(_,val){
          if (!Arr.contains(toRemove,val))
              result.push(val);
      })
      return result;
  }

  export function union<T>(a:T[], b:T[]):T[] {
      a = $.makeArray(a); b = $.makeArray(b);
      var result : T[] = [];
      $.each(a, function(_,val) {
          if (Arr.contains(b,val))
              result.push(val);
      });
      return result;
  }

  export function removeAt<T>(a:T[], i:number):T[] {
      // assert(i >= 0, "Arr.removeAt i>=0");
      // assert(i <= a.length, "Arr.removeAt i<=a.length");
      return a.slice(0,i).concat(a.slice(i+1));
  }

  export function removeOneMatching<T>(a:T[], p:(t:T)=>boolean):T[] {
      for (var i = 0; i < a.length; i++) {
          if (p(a[i]))
              return Arr.removeAt(a,i);
      }
      return a;
  }

  export function contains<T>(array:T[], value:any):boolean {
      return $.inArray(value, array) !== -1;
  }

  export function filter<T>(array:T[], predicate:(t:T)=>boolean):T[] {
      return $.grep(array, predicate);
  }

  /** Returns two new arrays, the first with those elements that satisfy the
    * predicate, the second with those that don't
    */
  export function partition<T>(array:T[], predicate:(t:T)=>boolean):T[][] {
      var good : T[] = [];
      var bad : T[] = [];
      $.each(array, function(i, val) {
          if (predicate(val))
              good.push(val);
          else
              bad.push(val);
      });
      return [good,bad];
  }

  /**
    * @param {!Array} array
    * @param {!function(*):boolean=} predicate
    * @return {!boolean}
    */
  export function all<T>(array:T[], predicate?:(t:T)=>boolean):boolean {
      if (!predicate) predicate = function(x:T):boolean { return !!x; };
      for (var i = 0; i < array.length; i++)
          if (!predicate(array[i]))
              return false;
      return true;
  }

  /**
    * @param {!Array} array
    * @param {function()=} predicate
    * @return {!boolean}
    */
  export function any<T>(array:T[], predicate?:(t:T)=>boolean):boolean {
      if (!predicate) predicate = function(x:T):boolean { return !!x; };
      for (var i = 0; i < array.length; i++)
          if (predicate(array[i]))
              return true;
      return false;
  }

  /**
    * @param {!Array} array
    * @param {!function(*):boolean=} predicate
    * @return {!boolean}
    */
  export function none<T>(array:T[], predicate?:(t:T)=>boolean):boolean {
      return !Arr.any(array,predicate);
  }

  /**
    * @param {!Array} array
    * @return {!Array}
    */
  export function unique<T>(array:T[]):T[] {
      var lookup = {};
      var result : T[] = [];
      for (var i = 0; i < array.length; i++) {
          var val = array[i];
          if (lookup[<any>(val)])
              continue;
          lookup[<any>(val)] = true;
          result.push(val);
      }
      return result;
  }

  /**
    * @param {!Array} arrays
    * @return {!Array}
    */
  export function concat<T>(arrays:T[][]):T[] {
      var result : T[] = [];
      $.each(arrays, function(_,array) {
          result = result.concat(array);
      });
      return result;
  }

  /**
    * @param {!Array} array
    * @param {!function(*):Array} f
    * @return {!Array}
    */
  export function concatMap<T,U>(array:T[], f:(t:T)=>U[]):U[] {
      return Arr.concat($.map(array,f));
  }
}
