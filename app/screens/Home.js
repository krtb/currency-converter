/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Button';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';

import { changeCurrencyAmount, swapCurrency } from '../actions/currencies';

const TEMP_LAST_CONVERTED = new Date();

class Home extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        baseCurrency: PropTypes.string,
        quoteCurrency: PropTypes.string,
        amount: PropTypes.number,
        conversionRate: PropTypes.number,
        isFetching: PropTypes.bool,
        lastConvertedDate: PropTypes.object,
        primaryColor: PropTypes.string,
    };

    handleChangeText = (text) => {
        const { dispatch } = this.props;
        dispatch(changeCurrencyAmount(text));
    };

    handlePressBaseCurrency = () => {
        const { navigation } = this.props;
        navigation.navigate('CurrencyList', { title: 'Base Currency', 
        type: 'base'});
    };

    handlePressQuoteCurrency = () => {
        const { navigation } = this.props;
        navigation.navigate('CurrencyList', { title: 'Quote Currency',
        type: 'quote' });
    };

    handleSwapCurrency = () => {
        const { dispatch } = this.props;
        dispatch(swapCurrency());
    };

    handleOptionsPress = () => {
        const { navigation } = this.props;
        navigation.navigate('Options');
    };

    render() {
        let quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
        if (this.props.isFetching) {
            quotePrice = '...';
        };

        return (
            <Container backgroundColor={this.props.primaryColor} >
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <Header onPress={this.handleOptionsPress} />
                <KeyboardAvoidingView behavior="padding">
                    <Logo tintColor={this.props.primaryColor} />
                    <InputWithButton
                        buttonText={this.props.baseCurrency}
                        onPress={this.handlePressBaseCurrency}
                        defaultValue={this.props.amount.toString()}
                        keyboardType="numeric"
                        onChangeText={this.handleChangeText}
                        textColor={this.props.primaryColor}
                    />
                    <InputWithButton
                        editable={false}
                        buttonText={this.props.quoteCurrency}
                        onPress={this.handlePressQuoteCurrency}
                        value={quotePrice}
                        textColor={this.props.primaryColor}
                    />
                    <LastConverted
                        date={this.props.lastConvertedDate}
                        base={this.props.baseCurrency}
                        quote={this.props.quoteCurrency}
                        conversionRate={this.props.conversionRate}
                    />
                    <ClearButton onPress={this.handleSwapCurrency} text="Reverse Currencies" />
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

// taking the redux state and mapping it to the component's props
// anything that is returned in the below object
// will be available to this component via "this.props"

// mapping "initial state" from the currencies inside of our Reducers for State
const mapStateToProps = (state) => {
    const baseCurrency = state.currencies.baseCurrency;
    const quoteCurrency = state.currencies.quoteCurrency;
    const conversionSelector = state.currencies.conversions[baseCurrency] || {};
    const rates = conversionSelector.rates || {};
    return {
        baseCurrency,
        quoteCurrency,
        amount: state.currencies.amount,
        conversionRate: rates[quoteCurrency] || 0,
        isFetching: conversionSelector.isFetching,
        lastConvertedDate: conversionSelector.date ? new Date(conversionSelector.date) : new Date(),
        primaryColor: state.theme.primaryColor,
    };
};

export default connect(mapStateToProps)(Home);
