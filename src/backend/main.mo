import Array "mo:base/Array";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Prim "mo:prim";
import AccessControl "./authorization/access-control";

actor {

  stable var accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) {};
      case (?adminToken) {
        AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller)
  };

  public type Order = {
    id : Text;
    customerName : Text;
    phone : Text;
    productName : Text;
    price : Nat;
    deliveryCharge : Nat;
    status : Text;
    pickupCity : Text;
    createdAt : Int;
    thickness : Text;
    expectedDelivery : Text;
    frameOptions : Text;
    customSize : Text;
    quantity : Nat;
  };

  public type NewOrder = {
    customerName : Text;
    phone : Text;
    productName : Text;
    price : Nat;
    deliveryCharge : Nat;
    status : Text;
    pickupCity : Text;
    thickness : Text;
    expectedDelivery : Text;
    frameOptions : Text;
    customSize : Text;
    quantity : Nat;
  };

  public type OrderUpdate = {
    status : ?Text;
    deliveryCharge : ?Nat;
    expectedDelivery : ?Text;
  };

  stable var ordersStore : [Order] = [];
  stable var orderCounter : Nat = 0;

  public func placeOrder(input : NewOrder) : async Order {
    orderCounter += 1;
    let ts = Int.abs(Time.now()) / 1_000_000;
    let id = "TDG" # Nat.toText(ts) # Nat.toText(orderCounter);
    let order : Order = {
      id;
      customerName = input.customerName;
      phone = input.phone;
      productName = input.productName;
      price = input.price;
      deliveryCharge = input.deliveryCharge;
      status = input.status;
      pickupCity = input.pickupCity;
      createdAt = Time.now();
      thickness = input.thickness;
      expectedDelivery = input.expectedDelivery;
      frameOptions = input.frameOptions;
      customSize = input.customSize;
      quantity = input.quantity;
    };
    ordersStore := Array.append(ordersStore, [order]);
    order
  };

  public query func getOrders() : async [Order] {
    ordersStore
  };

  public query func getOrdersByPhone(phone : Text) : async [Order] {
    Array.filter<Order>(ordersStore, func(o : Order) : Bool { o.phone == phone })
  };

  public func updateOrder(id : Text, update : OrderUpdate) : async ?Order {
    var found : ?Order = null;
    ordersStore := Array.map<Order, Order>(ordersStore, func(o : Order) : Order {
      if (o.id == id) {
        let updated : Order = {
          id = o.id;
          customerName = o.customerName;
          phone = o.phone;
          productName = o.productName;
          price = o.price;
          deliveryCharge = switch (update.deliveryCharge) { case (?v) v; case null o.deliveryCharge };
          status = switch (update.status) { case (?v) v; case null o.status };
          pickupCity = o.pickupCity;
          createdAt = o.createdAt;
          thickness = o.thickness;
          expectedDelivery = switch (update.expectedDelivery) { case (?v) v; case null o.expectedDelivery };
          frameOptions = o.frameOptions;
          customSize = o.customSize;
          quantity = o.quantity;
        };
        found := ?updated;
        updated
      } else o
    });
    found
  };

  public func deleteOrder(id : Text) : async Bool {
    let before = ordersStore.size();
    ordersStore := Array.filter<Order>(ordersStore, func(o : Order) : Bool { o.id != id });
    ordersStore.size() < before
  };

  public func clearAllOrders() : async () {
    ordersStore := [];
  };

}
