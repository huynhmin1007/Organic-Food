package com.minn.organicfood.shared.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/connect")
public class GlobalController {

    @GetMapping
    public String connect() {
        return "Connected";
    }
}
