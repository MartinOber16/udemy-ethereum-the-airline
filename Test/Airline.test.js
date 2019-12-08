const Airline = artifacts.require('Airline');

let instance;

// Con beforeEach se creara una nueva instancia del smartcontract para cada test. Siempre estara en el estado inicial para cada prueba
beforeEach(async () => {
    // Airline.deployed();
    instance = await Airline.new(); // Desplegara el contrato para cada test. Es un metodo asincrono!
});

// Framework de testing de truffle permite hacer pruebas con smartcontracts y obtener las cuentas
contract('Airline', accounts => {
    it('should have available flights', async () => {
        let total = await instance.totalFlights();
        assert(total > 0);
    });

    it('should allow customers to buy a flight providing its value', async () => {
        // Obtengo los datos del primer vuelo
        let flight = await instance.flights(0);
        let flightName = flight[0], price = flight[1];
        // Compro un vuelo
        await instance.buyFlight(0, { from: accounts[0], value: price });
        // Compruebo si se compro el vuelo
        let customerFlight = await instance.customerFlights(accounts[0], 0);
        let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);
        //console.log(customerFlight, customerTotalFlights);

        assert(customerFlight[0], flightName);
        assert(customerFlight[1], price);
        assert(customerTotalFlights, 1);
    });

    it('should not allow customers to buy flights under the price', async () => {
        // Obtengo los datos del primer vuelo
        let flight = await instance.flights(0);
        let price = flight[1] - 5000;

        // Compro un vuelo
        try{
            await instance.buyFlight(0, { from: accounts[0], value: price });
        }
        catch(e) {
            return;
        }

        // si llega aca es porqeu hubo un error en la prueba
        assert.fail();
    }); 
    
    it('should get the real balance of the contract', async () => {
        // Obtengo los datos del primer vuelo
        let flight = await instance.flights(0);
        let price = flight[1];

        let flight2 = await instance.flights(1);
        let price2 = flight2[1];
        
        await instance.buyFlight(0, { from: accounts[0], value: price });
        await instance.buyFlight(1, { from: accounts[0], value: price2 });
        
        let newAirlineBalance = await instance.getAirlineBalance();

        assert.equal(newAirlineBalance.toNumber(), price.toNumber() + price2.toNumber());
    });

    it('should allow customers to redeem loyalty points', async () => {
        let flight = await instance.flights(1);
        let price = flight[1];

        await instance.buyFlight(1, { from: accounts[0], value: price });

        let balance = await web3.eth.getBalance(accounts[0]);
        await instance.redeemLoyaltyPoints({from: accounts[0]});
        let finalBalance = await web3.eth.getBalance(accounts[0]);

        let customer = await instance.customers(accounts[0]);
        let loyaltyPoints = customer[0];

        assert(loyaltyPoints, 0);
        assert(finalBalance > balance);
    });

});
