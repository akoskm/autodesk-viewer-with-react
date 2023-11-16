export interface Door {
  object_id: string;
  door_name: string;
  door_number: string;
  fire_rating: string;
  width: string;
  height: string;
  thickness: string;
  door_type: string;
  door_material: string;
  door_finish: string;
  frame_material: string;
  frame_finish: string;
  frame_fill: string;
  door_hardware_id?: string;
  is_recommendation?: boolean;
}

export interface Room {
  id?: string;
  object_id: string;
  room_name: string;
  room_number: string;
  room_type: string;
  doors: string[];
  windows: string[];
  partitions: string[];
  finishes?: string[];
  length: string;
  width: string;
  height: string;
  rt_goal: string;
  nc_goal: string;
  rc_goal: string;
}

export interface Window {
  object_id: string;
  window_name: string;
  window_number: string;
  level: string;
  sill_height: string;
  width: string;
  height: string;
  window_glazing: string;
  window_finish: string;
  door_hardware_id?: string;
  is_recommendation?: boolean;
}

export interface DoorHardwareFields extends DoorHardwareSeals {
  id?: string;
  type: string;
  hinge?: string;
  threshold?: string;
  undercut?: string;
}

export interface DoorHardwareSeals {
  head?: string;
  jamb?: string;
  secondary?: string;
  bottom?: string;
  bottomIsMortised?: boolean;
  astragal?: string;
  astragalIsMortised?: boolean;
}

export interface Units {
  imperial: string;
  metric: string;
}

export interface ColumnProps {
  prefix?: string;
  name: string;
  width: number;
  units?: Units;
}

export interface Partition {
  id?: string;
  object_id: string;
  name: string;
  fire_rating: string;
  width: string;
  length: string;
  area: string;
  volume: string;
  structural_material: string;
  frame_material: string;
  glazing_material: string;
  function: string;
  side_a?: string;
  side_b?: string;
  is_recommendation?: boolean;
}

export interface CategoryObject {
  [key: string]: Record<string, string>;
}

export interface KeyValueObject {
  category: string;
  propertyName: string;
  value: string;
}

export interface TerminalUnit {
  id: string;
  autodesk_projects_id: string;
  terminal_unit_categories_id: string;
  object_id: string;
  name: string;
  properties: CategoryObject;
}

export interface TerminalUnitRemap {
  id: string;
  terminal_unit_categories_id: string;
  column_name: string;
  property_group_name: string;
  property_name: string;
}

export interface TerminalUnitCategory {
  id: string;
  autodesk_projects_id: string;
  name: string;
  terminal_units: TerminalUnit[];
  terminal_unit_remaps: TerminalUnitRemap[];
}

export interface TerminalUnitSettings {
  id: string;
  autodesk_projects_id: string;
  is_categorized: boolean;
}

export interface AuthenticationResponse {
  data?: AuthData;
  error?: ErrorResponse;
}

interface Response {
  message?: string;
}

export interface ErrorResponse extends Response {
  title?: string;
  internal?: boolean;
}

export type AuthenticationForm = {
  email: string;
  password: string;
};

export interface RegistrationForm extends AuthenticationForm {
  confirmPassword: string;
}

export interface OrganizationRegistrationForm extends RegistrationForm {
  organizationId: string;
  organizationName: string;
}

export interface AuthData extends Response {
  twoFactorCode?: string;
  twoFactorId?: string;
}

export interface UserSettings {
  preferred_metric_unit?: string;
  date_locale?: string;
  dp_selected_start_date?: string;
  dp_selected_completion_date?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  project_phases?: ProjectPhase[];
  project_snapshots: ProjectSnapshot[];
}

export interface ProjectPhase {
  id: string;
  description: string;
  start_date: Date | string;
  completion_date: Date | string;
  status?: string;
}

export interface ProjectPhaseOptions {
  id: string;
  description: string;
  start_date?: Date | string;
  completion_date?: Date | string;
}

export interface ProjectSnapshot {
  id: string;
  message: string;
  project_phases_id?: string;
  autodesk_project: AutodeskProject;
  is_read_only: boolean;
  created_at: Date | string;
}

export interface ProjectSnapshotOptions {
  id: string;
  message: string;
  created_at: Date | string;
}

export interface ProjectDetails {
  project: Project;
  autodesk_projects: AutodeskProject[];
}

export interface AutodeskProjectDetails {
  autodesk_projects_id?: string;
  project_name: string;
}

export interface ViewerObject
  extends Partial<Door>,
    Partial<Window>,
    Partial<Room>,
    Partial<Partition>,
    Partial<TerminalUnit> {
  object_id: string;
  object_category: string;
  name: string;
}

const AUTODESK_OBJECT_CATEGORY = {
  DOOR: "door",
  WINDOW: "window",
  ROOM: "room",
  PARTITION: "wall",
  TERMINAL_UNIT: "mechanical equipment",
} as const;

type ObjectValues<T> = T[keyof T];

export type AutodeskObjectCategory = ObjectValues<
  typeof AUTODESK_OBJECT_CATEGORY
>;

export interface AutodeskProject {
  id: string;
  project_snapshots_id: string;
  user_id: string;
  project_urn: string;
  autodesk_project_detail: AutodeskProjectDetails;
  doors: Door[];
  door_recommendations: Door[];
  windows: Window[];
  window_recommendations: Window[];
  door_hardware: DoorHardwareFields[];
  rooms: Room[];
  partitions: Partition[];
  partition_recommendations: Partition[];
  terminal_units: TerminalUnit[];
  terminal_unit_categories: TerminalUnitCategory[];
  terminal_unit_settings: TerminalUnitSettings[];
}

export interface AutodeskProjectOptions {
  id: string;
  project_urn: string;
  project_name: string;
}

export interface DoorHardwareOptions {
  id: string;
  type: string;
  hinge?: string;
}

export interface MeasuringSelectOptions {
  name: "Inches" | "Feet" | "Millimeters";
  unit: string;
}

export interface ProjectCollapse {
  id: string;
  value: boolean;
}

export interface GraphQLContext {
  user_id: string;
}

export interface HTTPError {
  statusCode: number;
  message: string;
}

export interface AutodeskModel {
  displayName: string;
  urn: string;
}
export interface AutodeskDoorObjectProperties {
  "Materials and Finishes": Record<string, string>;
  Dimensions: {
    Height: string;
    Width: string;
    Thickness: string;
  };
  "Identity Data": {
    Mark: string;
    "Fire Rating": string;
    "Type Mark": string;
    "OmniClass Title": string;
  };
}

export interface AutodeskWindowObjectProperties {
  Constraints: {
    Level: string;
    "Sill Height": string;
  };
  "Materials and Finishes": Record<string, string>;
  Dimensions: {
    Height: string;
    Width: string;
  };
  "Identity Data": {
    Mark: string;
  };
}

export interface AutodeskTerminalUnitObjectProperties {
  "Identity Data": {
    Mark: string;
    Manufacturer: string;
    Model: string;
    "Unit Size": string;
    Airflow: string;
    "Delta SP": string;
  };
}

export interface AutodeskObject {
  objectid: number;
  name: string;
  properties:
    | AutodeskDoorObjectProperties
    | AutodeskWindowObjectProperties
    | Record<string, Record<string, string | number>>;
}

export interface ObjectCategories {
  id: string;
  name: string;
  object_ids: number[];
}

export interface AutodeskGroupObject {
  objectid: number;
  objects: AutodeskObject[];
  name: string;
}

export interface AutodeskMainObject {
  objectid: number;
  objects: AutodeskGroupObject[];
  name: string;
}

export interface AutodeskObjectStructure {
  objectid: number;
  objects: AutodeskMainObject[];
  name: string;
}

export interface RequestError {
  message: string;
  response: {
    status: number;
  };
}
