import React from 'react'
import { NavigationMenu } from 'radix-ui'
import { Link } from "react-router-dom"
import './NavBar.css'

function NavBar() {
  return (
    <NavigationMenu.Root className='navigation-menu'>
      <NavigationMenu.List className='navigation-menu-list'>
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            <Link to="/">Home</Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link>
            <Link to="/docs">Docs</Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export default NavBar