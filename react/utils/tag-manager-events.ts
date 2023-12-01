export function eventTagManager() {
  const creativeName = sessionStorage.getItem('creative_name') || ''
  const creativeSlot = sessionStorage.getItem('creative_slot') || ''
  const itemListName = sessionStorage.getItem('item_list_name') || ''
  const promotionName = sessionStorage.getItem('promotion_name') || ''
  const promotionId = sessionStorage.getItem('promotion_id') || ''

  const dataLayer = window.dataLayer

  const lastIndex = window.dataLayer.length - 1
  let lastEvent = window.dataLayer[lastIndex]
  if (
    ['gtm.load', 'gtm.dom', 'gtm.scroll'].includes(lastEvent.event) &&
    dataLayer.length > 1
  ) {
    lastEvent = dataLayer[dataLayer.length - 2]
  }

  if (lastEvent.event === 'select_promotion') {
    if (
      lastEvent.ecommerce &&
      lastEvent.ecommerce.promotion_name !== undefined
    ) {
      sessionStorage.setItem(
        'promotion_name',
        lastEvent.ecommerce.promotion_name
      )
    }
    if (
      lastEvent.ecommerce &&
      lastEvent.ecommerce.creative_slot !== undefined
    ) {
      sessionStorage.setItem('creative_slot', lastEvent.ecommerce.creative_slot)
    }
    if (lastEvent.ecommerce && lastEvent.ecommerce.promotion_id !== undefined) {
      sessionStorage.setItem('promotion_id', lastEvent.ecommerce.promotion_id)
    }
    if (
      lastEvent.ecommerce &&
      lastEvent.ecommerce.creative_name !== undefined
    ) {
      sessionStorage.setItem('creative_name', lastEvent.ecommerce.creative_name)
    }
  }
  //   const lastEvent = lastEvent
  if (lastEvent.event === 'select_item') {
    if (
      lastEvent.ecommerce &&
      lastEvent.ecommerce.item_list_name !== undefined
    ) {
      sessionStorage.setItem(
        'item_list_name',
        lastEvent.ecommerce.item_list_name
      )
    }
  }

  const ecommerce = lastEvent?.ecommerce || {}
  let items = ecommerce?.items || []

  items = items.map(function (item: any) {
    var newItem = Object.assign({}, item)
    if (creativeName) newItem.promotion_name = promotionName
    if (creativeName) newItem.creative_name = creativeName
    if (creativeSlot) newItem.creative_slot = creativeSlot
    if (creativeSlot) newItem.promotion_slot = promotionId
    if (itemListName) newItem.item_list_name = itemListName
    return newItem
  })

  const enrichedEcommerceData = {
    coupon: ecommerce.coupon,
    currency: ecommerce.currency,
    payment_type: ecommerce.payment_type,
    shipping: ecommerce.shipping,
    shipping_tier: ecommerce.shipping_tier,
    tax: ecommerce.tax,
    transaction_id: ecommerce.transaction_id,
    value: ecommerce.value,
    items: items,
  }
  // Push a new event to the data layer with the '_enriched' suffix
  // and the enriched e-commerce data.
  console.log({
    event: lastEvent.event + '_enrichedcustom',
    ecommerce: enrichedEcommerceData,
  });

  dataLayer.push({
    event: lastEvent.event + '_enrichedcustom',
    ecommerce: enrichedEcommerceData,
  });

  if (lastEvent.event === 'purchase') {
    sessionStorage.clear()
  }
}

export function gtag() {
  window.dataLayer.push(arguments)
}
