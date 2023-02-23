import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaTasks,
  FaCalendarPlus,
  FaCalendarCheck,
  FaClock,
  FaSquareFull,
} from 'react-icons/fa';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { Box } from '@mui/material';
import { MdDoubleArrow } from 'react-icons/md';
import axios from 'axios';
import 'react-pro-sidebar/dist/css/styles.css';
import './SideBar.css';

const SidebarPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };
  const [availableTasksLists, setAvailableTasksLists] = useState([]);
  const [width, setWidth] = useState('');
  const [display, setDisplay] = useState(false);
  const [breakPointSideBar, setBreakPointSideBar] = useState('');
  let navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getTaskListsMenuItems = () => {
    if (!availableTasksLists) {
      return {[]};
    }
    return availableTasksLists.map((list) => {
      return {
        name: list.listName,
        link: `/list/${list.listName}/${list._id}`,
        icon: <FaSquareFull color={list.color} />,
        suffix: '',
      };
    });
  };

  const pages = [
    { name: 'Today', link: '/tasks/todayTasks', icon: <FaTasks />, suffix: '' },
    {
      name: 'Upcoming',
      link: '/tasks/upcomingTasks',
      icon: <MdDoubleArrow />,
      suffix: '',
    },
    {
      name: 'Add New Task',
      link: '/addTask',
      icon: <FaCalendarPlus />,
      suffix: '',
    },
    {
      name: 'Completed',
      link: '/tasks/completedTasks',
      icon: <FaCalendarCheck />,
      suffix: '',
    },
    {
      name: 'Expired',
      link: '/tasks/expiredTasks',
      icon: <FaClock />,
      suffix: '',
    },
    ...getTaskListsMenuItems(), // Add tasks' lists menu items
    { name: 'Add New List', link: '/add-list', icon: <FaPlus />, suffix: '' },
  ];

  const getSize = () => {
    setWidth(window.innerWidth);
  };

  const breakPoint = () => {
    setBreakPointSideBar(!breakPointSideBar);
  };

  useEffect(() => {
    window.addEventListener('resize', getSize);
    if (width < 780) {
      setCollapsed(true);
      setBreakPointSideBar(true);
    } else {
      setCollapsed(false);
      setBreakPointSideBar(false);
    }
    if (width < 481) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }
    return () => {
      window.removeEventListener('resize', getSize);
    };
  }, [width]);

  useEffect(() => {
    setDisplay(false);
    setCollapsed(false);
    if (localStorage.getItem('authToken')) {
      try {
        axios
          .get('/api/lists/getLists', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
          .then((res) => {
            setAvailableTasksLists(res.data);
          });
      } catch (error) {}
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100%',
        '& .pro-sidebar-inner': {
          backgroundColor: `#2a2e38 !important`,
          borderRadius: '10px',
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          borderRadius: '7px',
          backgroundColor: '#3e4452',
        },
        '& .pro-menu-item .active': {
          color: '#6870fa !important',
          backgroundColor: '#3e4452 !important',
        },
      }}
    >
      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        onToggle={handleToggleSidebar}
        breakPoint={breakPointSideBar ? 'xs' : ''}
        className='d-inline-block'
      >
        {/* Header */}
        <SidebarHeader>
          <Menu iconShape='circle'>
            {collapsed ? (
              <MenuItem
                icon={<FaBars />}
                onClick={handleCollapsedChange}
              ></MenuItem>
            ) : (
              <MenuItem suffix={<FaBars />} onClick={handleCollapsedChange}>
                <div className='logo'>Tasks 2 Do</div>
              </MenuItem>
            )}
          </Menu>
        </SidebarHeader>
        {/* Content */}
        <SidebarContent>
          <Menu iconShape='circle'>
            {pages.map((page, index) => (
              <MenuItem
                key={index}
                icon={page.icon}
                suffix={<span className='badge red'>{page.suffix}</span>}
              >
                {page.name}
                <NavLink to={page.link} />
              </MenuItem>
            ))}
          </Menu>
        </SidebarContent>
        {/* Footer */}
        <SidebarFooter>
          <div
            className='sidebar-btn-wrapper d-flex justify-content-center'
            style={{ padding: '16px' }}
          >
            <Link
              className='sidebar-btn logout-btn text-decoration-none'
              style={{ cursor: 'pointer', color: '#107ea2' }}
              to='/Login'
              onClick={() => handleSignOut()}
            >
              <span className='me-2'>
                <FaSignOutAlt />
              </span>
              {collapsed ? '' : <span>Sign out</span>}
            </Link>
          </div>
        </SidebarFooter>
      </ProSidebar>
      <div
        className={`${display ? 'd-inline-block ms-2' : 'display'}`}
        onClick={breakPoint}
      >
        <FaBars />
      </div>
    </Box>
  );
};

export default SidebarPage;
