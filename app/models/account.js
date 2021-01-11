let accountData = {};

class AccountTransactionModel {

    static data = {};
    static reset () { accountData = {}; }

    constructor (account_id) {
        this.account_id = account_id;
    }


    deposit (amount) {
        if (accountData[this.account_id])
            accountData[this.account_id] += amount;
        else
            accountData[this.account_id] = amount;
        return this;
    }

    withdraw (amount) {
        if (accountData[this.account_id])
            accountData[this.account_id] -= amount;
        return this;
    }

    transfer (destination, amount) {
        if (accountData[this.account_id] !== undefined) {
            accountData[this.account_id] -= amount;
            accountData[destination] += amount;
        }
        return this;
    }

    balance () {
        if (accountData[this.account_id] === undefined)
            return null;
        return {
            "id": this.account_id,
            "balance": accountData[this.account_id]
        };
    }

}

module.exports = AccountTransactionModel;
