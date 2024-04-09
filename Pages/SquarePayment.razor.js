/////////////////// Card payments
async function CardPay(fieldEl, buttonEl) {
    // Create a card payment object and attach to page
    window.card = await window.payments.card({
        style: {
            '.input-container': {
                borderColor: '#BDBDBD'
            },
            '.input-container.is-focus': {
                borderColor: '#006BD9'
            },
            '.message-text.is-error': {
                color: '#BF0020'
            }
        }
    });
    await window.card.attach(fieldEl);
    window.paymentInstance.invokeMethodAsync('FinishedLoading');
}


export async function SubmitClicked(address, amount, currencyCode, charge) {
    try {
        const result = await card.tokenize();
        if (result.status === 'OK') {
            var intent = charge ? 'CHARGE_AND_STORE' : 'STORE';
            var postcode = result.details.billing.postalCode;

            window.paymentInstance.invokeMethodAsync('PaymentErrorMessage', '', 'Contacting Bank - Please Wait...', '', true);
            // https://developer.squareup.com/reference/sdks/web/payments/objects/ChargeVerifyBuyerDetails
            // https://developer.squareup.com/docs/web-payments/sca

            const verificationDetails = {
                intent: intent,
                billingContact: {
                    addressLines: [address.addressLine1],
                    countryCode: address.squareCountryCode,
                    city: address.city,
                    postalCode: postcode,
                },
            };

            // Conditionally add amount and currencyCode if intent is not 'STORE'
            if (intent === 'CHARGE_AND_STORE') {
                verificationDetails.amount = amount;
                verificationDetails.currencyCode = currencyCode;
            }

            try {
                // Attempt to verify the buyer
                const verificationResults = await window.payments.verifyBuyer(
                    result.token,
                    verificationDetails
                );
                window.paymentInstance.invokeMethodAsync('SetPostCode', postcode);
                window.paymentInstance.invokeMethodAsync('ShowPleaseWait');

                console.log('Verification succeeded', verificationResults);
                //window.paymentInstance.invokeMethodAsync('MakePayment', result.token, verificationResults.token, verificationResults.userChallenged);
                window.paymentInstance.invokeMethodAsync('MakePayment', result.token, verificationResults.token, verificationResults.userChallenged, charge);
            } catch (error) {
                // If verification fails, call a failure handler function
                let result = error.message.startsWith('An issue occurred while verifying the buyer\n  The verification was not successful: verf:');
                // Avoid showing the useless error when a user clicks cancel on the SCA screen
                if (result === false) {
                    //window.showError(`Error: ${error.message}`);
                    window.paymentInstance.invokeMethodAsync('PaymentErrorMessage', error.name, error.message, error.stack, false);
                }
            }
        } else {
            window.paymentInstance.invokeMethodAsync('PaymentErrorMessage', '', result.errors[0].message, '', false);
        }
    } catch (e) {
        if (e.message) {
            window.paymentInstance.invokeMethodAsync('PaymentErrorMessage', e.name, e.message, e.stack, false);
        } else {
            window.paymentInstance.invokeMethodAsync('PaymentErrorMessage', '', 'Something went wrong', '', false);
        }
    }

    window.paymentInstance.invokeMethodAsync('EnableButtons');
}

async function SquarePaymentFlow(dotNetReference) {

    // Create card payment object and attach to page
    CardPay(document.getElementById('card-container'), document.getElementById('card-button'));
}

export function InitSquare(paymentRef, appId, locId) {
    window.paymentInstance = paymentRef;
    window.payments = Square.payments(appId, locId);

    SquarePaymentFlow();
}


export function DestroySquare() {
    window.paymentInstance = null;
    window.payments = null;

}
