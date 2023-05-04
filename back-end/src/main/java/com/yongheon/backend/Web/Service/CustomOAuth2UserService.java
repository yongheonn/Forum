package com.yongheon.backend.Web.Service;

import java.util.Collections;
import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;

import com.yongheon.backend.Security.OAuthAttributes;
import com.yongheon.backend.Web.DAO.RegisterDAO;
import com.yongheon.backend.Web.DAO.UserDAO;
import com.yongheon.backend.Web.DTO.UserDTO;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Inject
    private UserDAO userDAO;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint()
                .getUserNameAttributeName();

        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName,
                oAuth2User.getAttributes());

        String auth = saveOrUpdate(attributes);

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(auth)),
                attributes.getAttributes(),
                attributes.getNameAttributeKey());
    }

    private String saveOrUpdate(OAuthAttributes attributes) {
        UserDTO userDTO = userDAO.isRegistered(attributes.getEmail());

        if (userDTO == null)
            return "ROLE_GUEST";
        if (userDTO.getAuth() == 1)
            return "ROLE_USER_NONCERT";
        if (userDTO.getAuth() == 2)
            return "ROLE_USER_CERT";
        if (userDTO.getAuth() == 3)
            return "ROLE_ADMIN";

        return "ROLE_GUEST";

    }
}
