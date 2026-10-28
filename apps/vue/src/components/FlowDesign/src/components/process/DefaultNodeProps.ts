// Thuộc tính mặc định của nút phê duyệt
export const APPROVAL_PROPS = {
  assignedType: "ASSIGN_USER",
  mode: "AND",
  sign: false,
  nobody: {
    handler: "TO_PASS",
    assignedUser:[]
  },
  timeLimit:{
    timeout:{
      unit: "H",
      value: 0
    },
    handler:{
      type: "REFUSE",
      notify:{
        once: true,
        hour: 1
      }
    }
  },
  assignedUser:[],
  formPerms:[],
  selfSelect: {
    multiple: false
  },
  leaderTop: {
    endCondition: "TOP",
    endLevel: 1,
  },
  leader:{
    level: 1
  },
  role:[],
  refuse: {
    type: 'TO_END', // Quy tắc từ chối TO_END  TO_NODE  TO_BEFORE
    target: '' // Từ chối về nút có ID chỉ định
  },
  formUser: ''
}

// Thuộc tính mặc định của nút gốc
export const ROOT_PROPS = {
  assignedUser: [],
  formPerms:[]
}

// Thuộc tính mặc định của nút điều kiện
export const CONDITION_PROPS = {
  groupsType:"OR", // Quan hệ logic giữa các nhóm điều kiện OR, AND
  groups:[
    {
      groupType:"AND", // Quan hệ điều kiện trong nhóm điều kiện OR, AND
      cids:[], // Tập hợp ID điều kiện
      conditions:[] // Điều kiện con trong nhóm
    }
  ],
  expression: "" // Biểu thức tùy chỉnh, xây dựng quan hệ logic một cách linh hoạt
}

// Thuộc tính mặc định của nút gửi sao
export const CC_PROPS = {
  shouldAdd: false,
  assignedUser: [],
  formPerms:[]
}

// Thuộc tính mặc định của nút kích hoạt
export const TRIGGER_PROPS = {
  type: 'WEBHOOK',
  http:{
    method: 'GET', // Phương thức yêu cầu, hỗ trợ GET/POST
    url: '', // Địa chỉ URL, có thể mang trực tiếp tham số
    headers: [ //http header
      {
        name: '',
        isField: true,
        value: '' // Hỗ trợ biểu thức ${xxx}, xxx là tên trường form
      }
    ],
    contentType: 'FORM', // Kiểu tham số yêu cầu
    params:[ // Tham số yêu cầu
      {
        name: '',
        isField: true, // Là trường form hay tùy chỉnh
        value: '' // Hỗ trợ biểu thức ${xxx}, xxx là tên trường form
      }
    ],
    retry: 1,
    handlerByScript: false,
    success: 'function handlerOk(res) {\n  return true;\n}',
    fail: 'function handlerFail(res) {\n  return true;\n}'
  },
  email:{
    subject: '',
    to: [],
    content: ''
  }
}

// Thuộc tính mặc định của nút trì hoãn
export const DELAY_PROPS = {
  type: "FIXED", // Kiểu trì hoãn FIXED: trì hoãn một khoảng thời gian cố định sau khi tới nút hiện tại, AUTO: trì hoãn tới thời gian đã đặt trong dateTime
  time: 0, // Thời gian trì hoãn
  unit: "M", // Đơn vị thời gian D ngày H giờ M phút
  dateTime: "" // Nếu trong ngày chưa vượt qua thời điểm đã đặt này thì trì hoãn tới thời điểm chỉ định đó, đã tới thì bỏ qua luôn không trì hoãn
}

// Thuộc tính mặc định của HTTP EndPoint
export const HTTPENDPOINT_PROPS = {
  path: '',
  methods: [],
  readCotntent: false,
  targetType: '',
  schema: '',
  authorize: false,
  policy: '',
}

export default {
  APPROVAL_PROPS,
  CC_PROPS,
  DELAY_PROPS,
  CONDITION_PROPS,
  ROOT_PROPS,
  TRIGGER_PROPS,
  HTTPENDPOINT_PROPS,
}

export const PrimaryNodes = [
  'ROOT',
  'APPROVAL',
  'CC',
  'DELAY',
  'TRIGGER',
  'HTTPENDPOINT'
];
