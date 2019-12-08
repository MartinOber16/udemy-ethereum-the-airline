pragma solidity ^0.4.24;

contract Airline {
    address public owner;
    // Cliente
    struct Customer {
        uint loyaltyPoints;
        uint totalFlights; // numero de vuelos totales que ha comprado
    }

    // Vuelo
    struct Flight {
        string name;
        uint price;
    }

    // Defino cuanto vale cada punto en ethers
    uint etherPerPoint = 0.5 ether;

    // Listado de vuelos
    Flight[] public flights;

    mapping(address => Customer) public customers; // Relaciona la dirección con el Cliente
    mapping(address => Flight[]) public customerFlights; // Relaciona los vuelos de un Cliente por su dirección
    mapping(address => uint) public customerTotalFlights; // Total de los vuelos que ha comprado un cliente

    event FlightPurchased(address indexed customer, uint price); // Evento para cada compra

    constructor() public {
        owner = msg.sender;
        // Vuelos iniciales
        flights.push(Flight('tokio',4 ether));
        flights.push(Flight('Germany',1 ether));
        flights.push(Flight('Madrid',2 ether));
    }

    // Funcion para comprar el vuelo
    function buyFlight(uint flightIndex) public payable {
        Flight memory flight = flights[flightIndex]; // Identificar el vuelo que el cliente va a comprar
        require(msg.value == flight.price); // Requerir la cantidad de ethers del precio del vuelo

        Customer storage customer = customers[msg.sender]; // Identificar el Cliente
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender] ++;

        emit FlightPurchased(msg.sender, flight.price);
    }

    // Numeros totales de los vuelos que tiene disponibles la aerolinea
    function totalFlights() public view returns (uint){
        return flights.length;
    }

    // Cambiar los puntos por ethers
    function redeemLoyaltyPoints() public {
        Customer storage customer = customers[msg.sender];
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    // Saber cuantos ethers se pueden obtener con los puntos
    function getRefundableEther() public view returns (uint) {
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }


    // Obtener el balance de la aerolinea
    function getAirlineBalance() public view returns (uint) {
        address airlinesAddress = this;
        return airlinesAddress.balance;
    }

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
}