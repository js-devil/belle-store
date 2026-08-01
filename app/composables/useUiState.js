// Shared open/close state for the mobile nav drawer and search drawer.
// Both used to rely entirely on main.js's jQuery click handlers, which
// (like several other jQuery-driven interactions in this app) don't
// reliably attach to/stay in sync with Vue-rendered content - the mobile
// menu opening to a blank white panel and the search trigger doing nothing
// are both symptoms of that. Managed here in Vue instead, consistent with
// the currency picker, FAQ accordion, and category submenu fixes.
export function useUiState() {
  const isMobileNavOpen = useState("ui-mobile-nav-open", () => false);
  const isSearchOpen = useState("ui-search-open", () => false);

  function toggleMobileNav() {
    isMobileNavOpen.value = !isMobileNavOpen.value;
  }
  function closeMobileNav() {
    isMobileNavOpen.value = false;
  }
  function toggleSearch() {
    isSearchOpen.value = !isSearchOpen.value;
  }
  function closeSearch() {
    isSearchOpen.value = false;
  }

  return {
    isMobileNavOpen,
    isSearchOpen,
    toggleMobileNav,
    closeMobileNav,
    toggleSearch,
    closeSearch,
  };
}
