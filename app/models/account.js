let accountData = {};

class AccountTransactionModel {

    static data = {};
    static reset () { accountData = {}; }

    constructor (destination) {
        this.destination = destination;
    }


    deposit (amount) {
        if (accountData[this.destination])
            accountData[this.destination] += amount;
        else
            accountData[this.destination] = amount;
        return this;
    }

    balance () {
        return {
            "id": this.destination,
            "balance": accountData[this.destination]
        };
    }


}

module.exports = AccountTransactionModel;
