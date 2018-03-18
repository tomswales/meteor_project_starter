import {Meteor} from 'meteor/meteor';
import {extendObservable, computed, action, useStrict, toJS, ObservableMap} from 'mobx';
import ReactiveDataManager from './ReactiveDataManager'

export default class AppState {
    constructor() {
        // state can only be updated through actions
        useStrict(true);

        /*MOBX STATE*/
        extendObservable(this, {
            
            // Login
            enteringEmail: "",
            setEnteringEmail: action((newEmail) => {
                this.enteringEmail = newEmail;
            }),
            enteringPassword: "",
            setEnteringPassword: action((newPassword) => {
                this.enteringPassword = newPassword;
            }),
            isLoggedIn: false,
            setIsLoggedIn: action((newBoolean) => {
                this.isLoggedIn = newBoolean;
            }),

            // Manage Examples

            examplesLoading: false,
            examples: [],
            getExamples: computed(() => {
                return toJS(this.examples);            
            }),
            // updates examples with fresh data
            updateExamples: action((newExamples) => {
                this.examples = newExamples;
            }),
            setExamplesLoading: action((boolean) => {
                this.examplesLoading = boolean;
            }),

            // Manage dependents

            showDependentsMap: new ObservableMap(),
            toggleShowDependents: action((exampleId) => {
                if (this.showDependentsMap.get(exampleId)) {
                    this.showDependentsMap.set(exampleId, false);
                }
                else {
                    this.showDependentsMap.set(exampleId, true);
                }
            }),
            dependentFilter: [],
            getDependentFilterValues: computed(() => {
                return toJS(this.dependentFilter);
            }),
            addDependentFilterValue: action((exampleId) => {
                let filterArray = toJS(this.dependentFilter);
                if (!filterArray.includes(exampleId)) {
                    filterArray.push(exampleId);
                    this.dependentFilter= filterArray;
                    this.showDependentsMap.set(exampleId, true);
                }

            }),
            dependents: [],
            getDependents: computed(() => {
                return toJS(this.dependents);            
            }),

            // updates examples with fresh data
            updateDependents: action((newDependents) => {
                this.dependents = newDependents;
            }),
            setDependentsLoading: action((boolean) => {
                this.dependentsLoading = boolean;
            }),

            // remove all data when user logs out
            removeData: action(() => {
                this.dependents = [];
                this.examples = [];
                this.dependentFilter = [];
                this.showDependentsMap = new ObservableMap();
            })
        });

        /*FUNCTIONS TO CALL METEOR METHODS*/
        // calls Meteor to add a new example
        this.addExample = () =>{
            Meteor.call("addExample");
        };

        this.addDependentToExample = (_id) => {
            Meteor.call("addDependentToExample", _id);
        };

        /*REACTIVE DATA MANAGEMENT*/
        this.dataManager = new ReactiveDataManager(this);


        /*CALL METEOR METHODS*/
        // submit login details
        this.submitLoginDetails = () => {
            Meteor.loginWithPassword(this.enteringEmail, this.enteringPassword,
                (error) => {
                    if (error) {
                        console.log("Error: " + error.message);
                    }
                }
            );
            this.setEnteringEmail("");
            this. setEnteringPassword("");
        };

        // logout
        this.logout = () => {
            Meteor.logout(
                (error) => {
                    if (error) {
                        console.log("Error: " + error.message);
                    }
                });
        };
    }
}
