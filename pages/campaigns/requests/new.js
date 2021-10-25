import React, {Component} from 'react';
import {Form,  Message, Button, Input} from 'semantic-ui-react';
import Layout from "../../../components/Layout";
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

class RequestNew extends Component{

    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false
    }

    static async getInitialProps(props){
        // const campaign = Campaign(props.query.address);
        // const summary = await campaign.methods.getSummary().call();

        const {address} = props.query;


        return {
            address
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        const {description, value, recipient} = this.state;
        this.setState({loading:true})

        try{

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient)               
                .send({
                    from:accounts[0], 
                }); 

            // Router.replaceRoute(`/campaigns/${this.props.address}`);

        }catch (err){
            this.setState({errorMessage : err.message});
        }

        this.setState({loading:false, description:'', value: '', recipient:''});
        
    }

    render(){
        return (
            <Layout>
                <h3>Create a request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label htmlFor="">Description</label>
                        <Input value={this.state.description} 
                            onChange={event => this.setState({description: event.target.value})}
                            labelPosition="right"/>
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="">Value in Ether</label>
                        <Input value={this.state.value} 
                            onChange={event => this.setState({value: event.target.value})}
                            labelPosition="right"/>
                    </Form.Field>

                <Form.Field>
                    <label htmlFor="">Recipient</label>
                    <Input value={this.state.recipient} 
                        onChange={event => this.setState({recipient: event.target.value})}
                        labelPosition="right"/>
                </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>
                         Create
                    </Button>
                </Form>
            </Layout>

    )
    }
} 

export default RequestNew;