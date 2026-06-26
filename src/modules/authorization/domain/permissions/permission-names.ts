function crudActions(resource: string) {
  return {
    read: `${resource}.read`,
    create: `${resource}.create`,
    update: `${resource}.update`,
    delete: `${resource}.delete`,
  } as const;
}

export const Permissions = {
  users: crudActions('users'),
  userProfiles: crudActions('user-profiles'),
  masters: crudActions('masters'),
  masterProfiles: crudActions('master-profiles'),
  masterServices: crudActions('master-services'),
  masterWeeklySchedules: crudActions('master-weekly-schedules'),
  masterScheduleExceptions: crudActions('master-schedule-exceptions'),
  masterServiceReviews: crudActions('master-service-reviews'),
  appointments: crudActions('appointments'),
  appointmentChats: crudActions('appointment-chats'),
  appointmentChatMessages: crudActions('appointment-chat-messages'),
  files: crudActions('files'),
  folders: crudActions('folders'),
  rbac: crudActions('rbac'),
} as const;

export type TPermissionName =
  (typeof Permissions)[keyof typeof Permissions][keyof (typeof Permissions)[keyof typeof Permissions]];
