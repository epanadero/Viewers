Meteor.methods({
  initializeDemoLog:function (){
      console.log('initializeDemoLog');

      // hipaaEvent, userId, userName, collectionName, recordId, patientId, patientName, message
      HipaaLogger.logEvent("init", Session.get("userLogin"), "Ada Lovelace");

      HipaaLogger.logEvent("create", Session.get("userLogin"), "Ada Lovelace", "Users", Random.id(), Random.id(), "John Doe");

      HipaaLogger.logEvent("viewed", Session.get("userLogin"), "Mary Shelley", "Users", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("create", Session.get("userLogin"), "Florence Nightingale", "Vitals", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("viewed", Session.get("userLogin"), "Florence Nightingale", "Medications", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("create", Session.get("userLogin"), "Florence Nightingale", "Medications", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("denied", Session.get("userLogin"), "Kurt Vonnegut", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("create", Session.get("userLogin"), "Florence Nightingale", "Vitals", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("viewed", Session.get("userLogin"), "Florence Nightingale", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("modify", Session.get("userLogin"), "Florence Nightingale", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("viewed", Session.get("userLogin"), "Edward Doisy", "Users", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("clone", Session.get("userLogin"), "Edward Doisy", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("publish", Session.get("userLogin"), "Edward Doisy", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("unpublish", Session.get("userLogin"), "Edward Doisy", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("delete", Session.get("userLogin"), "Ada Lovelace", "MedicationPlans", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("viewed", Session.get("userLogin"), "Florence Nightingale", "Vitals", Random.id(), Random.id(), "John Doe");
      HipaaLogger.logEvent("create", Session.get("userLogin"), "Florence Nightingale", "Vitals", Random.id(), Random.id(), "John Doe");

     
  }
});
