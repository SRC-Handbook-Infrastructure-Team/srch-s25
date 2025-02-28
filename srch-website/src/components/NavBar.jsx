import React from "react";
import { NavigationMenu } from "radix-ui";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <NavigationMenu.Root className="navigation-menu">
      <NavigationMenu.List className="navigation-menu-list">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link to="/">Home</Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          {/* 1. Heading */}
          <NavigationMenu.Link asChild>
            <Link to="/">1. Fairness and Justice</Link>
          </NavigationMenu.Link>
          {/* sub menus of 1. */}
          <NavigationMenu.List className="navigation-menu-list">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link to="/">2.c.i. -- Abbrv</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link to="/">2.c.ii. - Abbrv</Link>
              </NavigationMenu.Link>
              <NavigationMenu.List className="navigation-menu-list">
                <NavigationMenu.Item>
                  <NavigationMenu.Link asChild>
                    <Link to="/">Appendix</Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item></NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link to="/">2. Data and AI: Accuracy, Fairness, and Justice</Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export default NavBar;
