import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
&:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor pointer;
}
align-items: flex-start;
position: relative;
background-attachment: scroll;
background-clip: border-box;
background-color: rgba(0, 0, 0, 0);
background-origin: padding-box;
border-image-repeat: stretch;
border-color: rgb(14, 14, 16);
border-width: 0px;
border-radius 4px;
box-sizing: border-box;
cursor: default;
font-size: 13px;
font-stretch: 100%;
font-style: normal;
font-weight: 400;
height: 30px;
letter-spacing: normal;
line-height: 19.5px;
text-align: start;
white-space: nowrap;
width: 30px;

`;

const LiButton = styled.button`
&:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor pointer;
}
align-items: flex-start;
position: relative;
background-attachment: scroll;
background-clip: border-box;
background-color: rgba(0, 0, 0, 0);
background-origin: padding-box;
border-image-repeat: stretch;
border-color: rgb(14, 14, 16);
border-width: 0px;
border-radius 4px;
box-sizing: border-box;
cursor: default;
font-size: 13px;
font-stretch: 100%;
font-style: normal;
font-weight: 500;
height: 30px;
letter-spacing: normal;
line-height: 19.5px;
text-align: start;
white-space: nowrap;
width: 220px;

`;

const LinkButton = styled(Link)`
display: inline-block;
color: black;
&:visited {
    color: black;
    text-decoration: none;
}
&:hover {
    background-color: rgba(0, 0, 0, 0.1);
    text-decoration: none;
    cursor: pointer;
}

align-items: flex-start;
position: relative;
background-attachment: scroll;
background-clip: border-box;
background-color: rgba(0, 0, 0, 0);
background-origin: padding-box;
border-image-repeat: stretch;
border-color: rgb(14, 14, 16);
border-width: 0px;
border-radius 4px;
box-sizing: border-box;
cursor: default;
font-size: 13px;
font-stretch: 100%;
font-style: normal;
font-weight: 500;
height: 30px;
letter-spacing: normal;
line-height: 19.5px;
text-align: start;
white-space: nowrap;
width: 220px;
padding: 1px 6px;

`;

export { Button, LiButton, LinkButton };
