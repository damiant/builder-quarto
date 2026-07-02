# PRD: Saved Gadgets Wishlist

## Overview

Shoppers should be able to save gadgets to a wishlist so they can return to products they are interested in and purchase them later. The first version supports signed-in shoppers only, with wishlist actions available on product detail pages.

## Goals

- Let signed-in shoppers save a gadget from its product page.
- Let signed-in shoppers remove a previously saved gadget from its product page.
- Provide a wishlist page or view where shoppers can see their saved gadgets.
- Let shoppers add saved gadgets to the cart from the wishlist.
- Confirm save and remove actions with toast messages.

## Non-goals

- Guest wishlists.
- Wishlist sharing.
- Wishlist access from product listing cards, the cart, or the site header.
- Price-change, low-stock, discontinued, or back-in-stock notifications.
- Multiple named wishlists.

## Target users

Signed-in shoppers browsing gadget product pages who want to remember products for later purchase.

## User stories

- As a signed-in shopper, I want to save a gadget from the product page so I can find it again later.
- As a signed-in shopper, I want to remove a saved gadget from the product page so my wishlist stays relevant.
- As a signed-in shopper, I want to view my saved gadgets in one place so I can compare items I am considering.
- As a signed-in shopper, I want to add a saved gadget to my cart so I can purchase it when I am ready.
- As a signed-in shopper, I want confirmation after saving or removing a gadget so I know the action succeeded.

## Functional requirements

### Product page save action

- Product detail pages must include a save-to-wishlist control.
- The control must show whether the current gadget is already saved.
- Selecting the control for an unsaved gadget must save it to the shopper's wishlist.
- Selecting the control for a saved gadget must remove it from the shopper's wishlist.
- The control must require the shopper to be signed in before saving.
- If an unauthenticated shopper attempts to save a gadget, the experience must direct them to sign in before the item can be saved.

### Toast feedback

- Saving a gadget must show a toast confirmation.
- Removing a gadget must show a toast confirmation.
- Toast messaging should be short and action-specific.
- Toasts should not block the shopper from continuing to browse.

### Wishlist view

- Signed-in shoppers must be able to view a basic list of saved gadgets.
- Each saved gadget should show at minimum:
  - Product image
  - Product name
  - Price
  - Remove action
  - Add-to-cart action
- Empty wishlists must show an empty state that helps the shopper continue browsing.

### Buy actions

- Shoppers must be able to add a saved gadget to the cart from the wishlist.
- Adding a saved gadget to the cart should not automatically remove it from the wishlist unless explicitly decided later.
- If a gadget cannot be added to the cart, the wishlist must show a clear failure state or message.

### Account and persistence

- Wishlists must be associated with signed-in shopper accounts.
- Saved gadgets must persist across sessions and devices for the same account.
- Wishlist data must not be visible to other shoppers.

## UX requirements

- Save and remove actions should feel immediate.
- Toast messages should confirm completion without interrupting browsing.
- The saved state on the product page must remain accurate after page refresh.
- The wishlist view should be simple and scannable.
- The empty state should provide a clear path back to shopping.

## Edge cases

- Shopper tries to save while signed out.
- Shopper saves a gadget, refreshes the page, and returns to the product page.
- Shopper removes a gadget from the product page and later opens the wishlist.
- Shopper removes a gadget from the wishlist and later opens the product page.
- Shopper attempts to add a saved gadget to the cart when the product is unavailable.
- Product details such as image, name, or price change after the gadget was saved.

## Analytics requirements

Track the following events:

- Gadget saved from product page.
- Gadget removed from product page.
- Gadget removed from wishlist.
- Saved gadget added to cart.
- Signed-out shopper prompted to sign in from save action.
- Wishlist viewed.

Each event should include product identifier, shopper account identifier where allowed, source surface, and timestamp.

## Success metrics

- Percentage of signed-in shoppers who save at least one gadget.
- Add-to-cart rate from wishlist.
- Purchase conversion rate for gadgets that were previously saved.
- Wishlist return rate within 7 and 30 days.
- Reduction in product rediscovery friction, measured through wishlist usage and repeat product views.

## Accessibility requirements

- Save controls must be reachable and operable by keyboard.
- Save controls must have accessible labels that distinguish save and remove states.
- Toast messages must be announced appropriately to assistive technologies.
- Wishlist actions must expose clear button labels, not icon-only meaning.
- Focus behavior must remain predictable after removing an item from the wishlist.

## Open questions

- Where should shoppers access the wishlist page if it is not exposed in the header for the first version?
- Should adding a saved gadget to cart keep it in the wishlist or offer a separate move-to-cart action?
- What sign-in flow should be used when a signed-out shopper attempts to save a gadget?
- Should the product page save control use a heart, bookmark, text button, or another visual pattern?
- Should duplicate saves be prevented silently, or should the shopper receive feedback that the gadget is already saved?
- Should the wishlist support sorting, filtering, or grouping in a later version?
- What should happen if a saved gadget is deleted from the catalog?

## Launch scope

Version 1 should include signed-in account persistence, product-page save and remove actions, toast confirmations, a basic wishlist view, remove actions, and add-to-cart actions from the wishlist.

Version 1 should exclude guest support, sharing, listing-card save controls, cart-based save controls, header entry points, product availability alerts, and multiple wishlists.
