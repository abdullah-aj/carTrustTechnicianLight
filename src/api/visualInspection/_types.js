// @flow

export interface VisualInspectionInterface {
  addVisualInspection(
    req: visualInspectionReqType,
  ): Promise<visualInspectionResType>;
}

export type visualInspectionReqType = {
  booking_id: number,
  vehicle_side: 'front' | 'back' | 'side_left' | 'side_right' | 'top',
  marked_img: string,
  camera_img: string,
  defect_type: string,
  comment: string,
};

export type visualInspectionResType = {
  data: Object,
};
