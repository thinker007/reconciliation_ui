class InternalReconciler {
    /** @type !Object.<!string,!Object.<!string,!RecGroup>> */
    private byType = {};

    register(entity:tEntity) {
      var recGroup = this.getRecGroup(entity);
      if (recGroup === undefined)
          return;
      recGroup.register(entity);
    }

  setMerged(entity:tEntity, shouldMerge:bool) {
    var recGroup = this.getRecGroup(entity);
    recGroup.shouldMerge = shouldMerge;
    if (shouldMerge === false) {
      recGroup.setID(undefined);
      $.each(recGroup.members, function(_, member) {
          //this may add duplicates, but that's ok
          automaticQueue.push(member);
      });
      removeReviewItem(recGroup);
    }
    else {
      $.map(recGroup.members, removeReviewItem);
    }
  }


  /** @param {!tEntity} entity
    * @return {(!RecGroup|undefined)}
    */
  getRecGroup(entity:tEntity):RecGroup {
    var type = entity.get("/type/object/type")[0];
    var name = this.normalizeName(entity.get("/type/object/name")[0]);
    if (Arr.any([type, name], isUndefined))
      return undefined;
    return this._getRecGroup(type, name);
  }

  /** @param {!string} type
  * @param {!string} name
  * @return {!RecGroup}
  */
  private _getRecGroup(type:string, name:string):RecGroup {
    if (!(type in this.byType))
      this.byType[type] = {};
    var byName = this.byType[type];
    if (!(name in byName))
      byName[name] = new RecGroup(type, name);
    return byName[name];
  }

  normalizeName(name:string):string {
    if (name)
      return $.trim(name)
    return name;
  }
}


class RecGroup {
  static groups:RecGroup[] = [];
  static id_counter = 0;

  members:tEntity[] = [];
  shouldMerge = false;
  reconciledTo:string;
  internal_id:number;
  constructor(public type:string, public name:string) {
    this.internal_id = RecGroup.id_counter++;
    RecGroup.groups[this.internal_id] = this;
  }

  register(entity:tEntity) {
    if (entity.getID() === "None (merged)") {
      entity.setID(undefined);
      this.reconciledTo = "None";
      this.shouldMerge = true;
    }

    this.members.push(entity);
  }

  setID(id:string) {
    this.reconciledTo = id;
    politeEach(this.members, function(_, member) {
      addColumnRecCases(member);
    });
  }

  getID() {
    var id = this.reconciledTo;
    if (id === "None" && this.shouldMerge)
      return "None (merged)";
    return id;
  }

  getInternalID() {
    return this.internal_id;
  }

  unreconcile() {
    this.reconciledTo = undefined;
  }
}
