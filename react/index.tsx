import { canUseDOM } from 'vtex.render-runtime'
import {
  AddToCartData,
  OrderPlacedData,
  PixelMessage,
  ProductViewData,
} from './typings/events'
import { gtag } from './utils/tag-manager-events'

export default function () {
  return null
}
declare var ttq: any
export function handleEvents(e: PixelMessage) {
  switch (e?.data?.eventName) {
    case 'vtex:addToCart': {
      const data = e.data as AddToCartData
      const sendData = {
        contents: [
          {
            content_id: data.items[0].skuId,
            content_name: data.items[0].name,
            quantity: data.items[0].quantity,
            price: data.items[0].price / 100,
          },
        ],
        content_type: 'product',
        currency: 'USD',
        value: data.items[0].price / 100,
      }
      ttq.track('AddToCart', sendData);
      // eventTagManager();
      (gtag as any)('event', 'conversion', {
        send_to: 'AW-11318482947/2wW7COikyfoYEIOwiZUq',
        value: 1.0,
        currency: 'USD',
      });
      break
    } 
    case 'vtex:productView': {
      const data = e.data as ProductViewData
      const sendData = {
        contents: [
          {
            content_id: data.product.selectedSku.itemId,
            content_name: data.product.productName,
            quantity: 1,
            price: data.product.selectedSku.sellers[0].commertialOffer.Price,
          },
        ],
        content_type: 'product',
        currency: 'USD',
        value: data.product.selectedSku.sellers[0].commertialOffer.Price,
      }
      ttq.track('ViewContent', sendData);
      (gtag as any)('event', 'conversion', {
        send_to: 'AW-11318482947/KT2WCIajy_oYEIOwiZUq',
        value: 1.0,
        currency: 'USD',
      });
    }
    // PURCHASED
    case 'vtex:orderPlaced': {
      console.log('vtex:orderPlaced', e)
      const data = e.data as OrderPlacedData
      const products = data.transactionProducts
      const sendData = {
        contents: products.map(product => ({
          content_id: product.sku,
          content_name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        content_type: 'product',
        currency: 'USD',
        value: data.transactionTotal,
      }
      console.log({
        email: data?.visitorContactInfo[0],
        phone_number: data?.visitorContactPhone,
      })
      ttq.identify({
        email: data?.visitorContactInfo[0],
        phone_number: data?.visitorContactPhone,
      })
      ttq.track('CompletePayment', sendData);
      // eventTagManager();
      (gtag as any)('event', 'conversion', {
        send_to: 'AW-11318482947/cCSxCIeusuoYEIOwiZUq',
        value: 1.0,
        currency: 'USD',
        transaction_id: '',
      });
      break
    }
    case 'vtex:pageView': {
      if (count < 1) {
        count++
        return
      }
      ttq.track('Page View');
      break;
    }
    case 'vtex:beginCheckout': {
      (gtag as any)('event', 'conversion', {
        'send_to': 'AW-11318482947/ROYMCNryx_oYEIOwiZUq',
        'value': 1.0,
        'currency': 'USD'
    });
    }
    // case 'vtex:removeFromCart' || 'vtex:beginCheckout' || 'vtex:addToWishlist' || 'vtex:viewCart' || 'vtex:beginCheckout' || 'vtex:addShippingInfo' || 'vtex:addPaymentInfo': {
      // eventTagManager();
    //   break;
    // }
    default: {
      break
    }
  }
}

let count = 0
if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
