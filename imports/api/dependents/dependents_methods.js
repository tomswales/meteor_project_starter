import { Meteor } from 'meteor/meteor';
import Dependents from './dependents.js';

if (Meteor.isServer) {
    Meteor.methods({
        addDependentToExample: function (exampleId) {
            const existingDependents = Dependents.find({exampleId: exampleId}).count();
            return Dependents.insert({created: new Date(), text: ("Dependent " + (existingDependents+1)), exampleId: exampleId}, function (error, result) {
                if (error) {
                    throw new Meteor.Error("Insert failed");
                }
                else {
                    return result;
                }
            });
        }
    })
}