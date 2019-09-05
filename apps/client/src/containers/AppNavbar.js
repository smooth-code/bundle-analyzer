import React from 'react'
import { Button, Box } from '@smooth-ui/core-sc'
import { FaGithub } from 'react-icons/fa'
import {
  Avatar,
  NavbarSecondary,
  Navbar,
  NavbarBrand,
  NavbarBrandLogo,
  BrandLogo,
  Menu,
  MenuItem,
  MenuDisclosure,
  useMenuState,
} from '../components'
import { useLogout } from './Auth'
import { useUser } from './User'

function UserMenu({ user }) {
  const logout = useLogout()
  const menu = useMenuState({
    placement: 'bottom-end',
    unstable_gutter: 4,
    unstable_animated: true,
  })

  return (
    <>
      <MenuDisclosure {...menu}>
        {({ type, ...disclosureProps }) => (
          <Avatar
            alt={user.name}
            src={`https://github.com/${user.login}.png?size=60`}
            {...disclosureProps}
          />
        )}
      </MenuDisclosure>
      <Menu {...menu}>
        <MenuItem {...menu} onClick={() => logout()}>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export function AppNavbar() {
  const user = useUser()
  return (
    <Navbar>
      <NavbarBrand>
        <NavbarBrandLogo>
          <BrandLogo />
        </NavbarBrandLogo>
        Bundle Analyzer
      </NavbarBrand>
      <NavbarSecondary>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Button
            variant="dark"
            as="a"
            href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`}
            display="flex"
            alignItems="center"
          >
            <Box as="span" mr={1}>
              Login
            </Box>
            <FaGithub />
          </Button>
        )}
      </NavbarSecondary>
    </Navbar>
  )
}
