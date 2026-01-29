package com.example.Decoria.dto;


import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class SendNotificationToUsersRequest {


    private List<UUID> userIds;
}
