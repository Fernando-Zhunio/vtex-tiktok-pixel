import { canUseDOM } from 'vtex.render-runtime'
import {
  AddToCartData,
  OrderPlacedData,
  PixelMessage,
  ProductViewData,
} from './typings/events'
// import { useRuntime } from 'vtex.render-runtime'

export default function () {
  return null
}
declare var ttq: any
export function handleEvents(e: PixelMessage) {
  // if (e?.data?.eventName) {
  //   console.log(e?.data?.eventName, e)
  //   localStorage.setItem(e.data.eventName, e.data.eventName)
  // }
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

      // console.log('addToCart', { e, sendData })
      ttq.track('AddToCart', sendData)
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

      // console.log('ViewContent', { e, sendData })
      ttq.track('ViewContent', sendData)
    }
    case 'vtex:orderPlaced': {
      // console.log('vtex:orderPlaced', e)
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
      ttq.track('CompletePayment', sendData)
      break
    }

    // case 'vtex:cartLoaded': {
    //   console.log('vtex:cartLoaded', e)
    //   break
    // }

    // case 'vtex:beginCheckout': {
    //   console.log('vtex:beginCheckout', e)
    //   break
    // }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}

