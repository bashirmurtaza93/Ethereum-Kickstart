import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign'; 
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from "../../components/contributeForm";
import {Link} from '../../routes';




class CampaignShow extends Component{

    static async getInitialProps(props){
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards(){

        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [{
            header: manager,
            meta: 'Address of manager',
            description: 'The manager created this camapaign and can create requests and withdraw money',
            style: {overflowWrap: 'break-word'}
        },
        {
            header: minimumContribution,
            meta: 'Minimum contribution (Wei)',
            description: 'You must contribute this much way to become an approver.'
        },
        {
            header: requestsCount,
            meta: 'Number of Requests',
            description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers'
        },
        {
            header: approversCount,
            meta: 'Number of Approvers',
            description: 'Number of people who contributed .'
        },
        {
            header: web3.utils.fromWei(balance,'ether'),
            meta: 'Campaign Balance (Ether)',
            description: 'The balance is how much money this campaign has to send.'
        }
    ];

        return <Card.Group items={items} />;
    }

    render(){
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                            <a href="">
                                <Button primary>
                                View Requests
                                </Button>
                            </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;