import React, {Component} from "react";
import Layout from "../../components/Layout";
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Link, Router} from '../../routes';



class CampaignNew extends Component {
    state = {
        mininumContribution: '',
        errorMessage:'',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        
        this.setState({loading:true, errorMessage:''});

        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.mininumContribution).send({
                from: accounts[0]
            });
            Router.pushRoute('/');
        } catch (err){
            this.setState({ errorMessage: err.message});
        }

        this.setState({loading:false});


    }

    render(){
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                    <label htmlFor="">Minimum Contribution</label>
                    <Input label="wei" labelPosition="right"
                           value={this.state.mininumContribution}
                           onChange={event => this.setState({mininumContribution:event.target.value})}/>
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create Campaign</Button>
                </Form>

            </Layout>
        )
        }

}

export default CampaignNew