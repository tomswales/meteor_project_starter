import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {autorun} from 'mobx';
import Examples from '../imports/api/examples/examples'
import Dependents from '../imports/api/dependents/dependents'


// A class for managing Meteor subscriptions based on observed changes in a state store
export default class ReactiveDataManager {
    // state - a Mobx store instance
    constructor(state) {
        // The reference to the Mobx state store
        this.state = state;

        //  We want to enforce max of only one subscription and observer at a time for each data manager
        this.examplesSubscription = null;
        this.examplesObserver = null;
        this.dependentsSubscription = null;
        this.dependentsObserver = null;

        // Use Meteor Tracker to reactively monitor user's logged in status
        this.monitorLoginState();

        // a Mobx autorun function for fetching data
        let examplesDataManager = autorun(() => {

            if (this.state.isLoggedIn) {
                this.resetExamplesSubscriptionAndObserver();

                // create a new Meteor subscription
                this.state.setExamplesLoading (true);
                this.examplesSubscription = Meteor.subscribe("examples", {
                    // callback when the Meteor subscription is ready
                    onReady: () => {
                        // create a Meteor observer to watch the subscription for changes and update data when they occur
                        this.examplesObserver = Examples.find().observe({
                            added: () => {
                                this.refreshExamples(state);
                            },
                            changed: () => {
                                this.refreshExamples(state);
                            }
                        });
                        this.state.setExamplesLoading(false);
                    }
                });
            }
        });

        let dependentsDataManager = autorun(() => {
            if (this.state.isLoggedIn) {
                let dependentFilter = this.state.getDependentFilterValues;

                this.resetDependentsSubscriptionAndObserver();

                // create a new Meteor subscription, but only if there are some filter values
                if (dependentFilter.length > 0) {
                    this.dependentsSubscription = Meteor.subscribe("dependents", dependentFilter, {
                        // callback when the Meteor subscription is ready
                        onReady: () => {
                            // create a Meteor observer to watch the subscription for changes and update data when they occur
                            this.dependentsObserver = Dependents.find().observe({
                                added: () =>{
                                    this.refreshDependents(state);
                                },
                                changed: () => {
                                    this.refreshDependents(state);
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    // Monitors whether user is logged in or not and sets the app state accordingly
    monitorLoginState() {
        // Reactive function which will update whenever Meteor login state changes
        Tracker.autorun(() => {
            // Check if Meteor has a user ID for the current user (i.e. is logged in)
            if (Meteor.userId()) {
                // Set UI state to logged in
                this.state.setIsLoggedIn(true);
            }
            else {
                // Set UI state to logged out
                this.state.setIsLoggedIn(false);
                // Kill any running subscriptions
                this.killSubscriptions();
            }
        });
    }

    // Refreshes the app state with the latest data from the Meteor subscription
    refreshExamples() {
        let refreshedExamples = Examples.find().fetch();
        this.state.updateExamples(refreshedExamples);
    };

    // Stops any existing example subscription and observer
    resetExamplesSubscriptionAndObserver() {
        // If a current subscription exists, it is now invalidated by the mobx autorun, so stop it
        if (this.examplesSubscription) {
            this.examplesSubscription.stop();
        }
        // same with the observer for the subscription
        if (this.examplesObserver) {
            this.examplesObserver.stop();
        }
    }

    // Refreshes the app state with the latest data from the Meteor subscription
    refreshDependents() {
        let refreshedDependents = Dependents.find().fetch();
        this.state.updateDependents(refreshedDependents);
    };

    // Stops any existing dependents subscription and observer
    resetDependentsSubscriptionAndObserver() {
        // If a current subscription exists, it is now invalidated by the mobx autorun, so stop it
        if (this.dependentsSubscription) {
            this.dependentsSubscription.stop();
        }
        // same with the observer for the subscription
        if (this.dependentsObserver) {
            this.dependentsObserver.stop();
        }
    }

    // kill all subscriptions
    killSubscriptions() {
        this.examplesSubscription = null;
        this.examplesObserver = null;
        this.dependentsSubscription = null;
        this.dependentsObserver = null;
        this.state.removeData();
    }
}

