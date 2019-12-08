import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: undefined
        };
    }

    // despues de que se cargo el componente
    async componentDidMount(){
        this.web3 = await getWeb3();
        console.log("Versión web3: " + this.web3.version);

        var account = (await this.web3.eth.getAccounts())[0];
        console.log("Cuenta actual: " + account);

        // Guardo en el estado la información de la cuenta y cuando esta lista ejecuto la funcion load
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        } );
    }

    async load(){
        console.log("Función load");
        
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">


                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}