import AirLineContract from "../build/contracts/Airline.json";
import contract from "truffle-contract";

export default async (provider) => {
    const airline = contract(AirLineContract);
    airline.setProvider(provider);

    let instance = await airline.deployed();
    console.log(instance.address);
    return instance;
}
