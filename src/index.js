var Datastore = require('@google-cloud/datastore');
var Logging = require('@google-cloud/logging').Logging;
var express = require('express');
var app = express();
var PurchaseDAO = /** @class */ (function () {
    function PurchaseDAO(purchase) {
        this.purchase = purchase;
        this.datastore = new Datastore({});
        var logging = new Logging();
        this.log = logging.log('mylog');
    }
    PurchaseDAO.prototype.getPurchasesByUser = function (user) {
        return null;
    };
    PurchaseDAO.prototype.recordPurchase = function () {
        var _this = this;
        var taskKey = this.datastore.key('Purchase');
        var entity = {
            key: taskKey,
            data: [
                {
                    name: 'Amount',
                    value: this.purchase.amount
                },
                {
                    name: 'Currency',
                    value: this.purchase.currency,
                    excludeFromIndexes: true
                },
                {
                    name: 'Quantity',
                    value: this.purchase.quantity
                },
                {
                    name: 'PurchaseTime',
                    value: this.purchase.purchaseDate
                },
                {
                    name: 'PurchaseType',
                    value: this.purchase.purchaseType
                },
                {
                    name: 'User',
                    value: this.purchase.user
                }
            ]
        };
        this.datastore
            .save(entity)
            .then(function () {
            var success = _this.log.entry("Task " + taskKey.id + " created successfully.");
            _this.log.write(success);
            console.log("Task " + taskKey.id + " created successfully.");
        })["catch"](function (err) {
            var error = _this.log.entry("Error" + err);
            _this.log.write(error);
            console.error('ERROR:', err);
        });
    };
    return PurchaseDAO;
}());
var Purchase = /** @class */ (function () {
    function Purchase(quantity, amount, currency, purchaseDate, purchaseType, user) {
        this.quantity = quantity;
        this.currency = currency;
        this.amount = amount;
        this.user = user;
        this.purchaseDate = purchaseDate;
        this.purchaseType = purchaseType;
    }
    return Purchase;
}());
var port = 8080;
app.get('/', function (req, res) {
    var pobj = new Purchase(10, 11, 'AUD', new Date(), 'Coffee', 'user');
    new PurchaseDAO(pobj).recordPurchase();
    console.log("completed");
    res.send('Completed');
});
app.listen(port);
