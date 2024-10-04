```mermaid
flowchart TD
    Start[Start]
    -->|Receive Request| CheckAddress{Is buyerAddress valid?}
    CheckAddress -->|No| ErrorInvalidAddress[Return Error: Invalid Address]
    CheckAddress -->|Yes| GetItemPrice[Get Item Price from Contract]
    GetItemPrice --> PrepareTransaction[Prepare purchaseItem Transaction with value]
    PrepareTransaction --> SignTransaction[Sign Transaction with Private Key]
    SignTransaction --> SendTransaction[Send Signed Transaction]
    SendTransaction --> ReceiveReceipt[Receive Transaction Receipt]
    ReceiveReceipt --> ReturnResponse[Return  transactionHash ]
    ReturnResponse --> End[End]
```
