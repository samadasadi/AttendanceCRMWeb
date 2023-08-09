function getIconUser_log(mode) {
    var result = { color: 'gray', icon: 'icon-circle' }
    switch (mode) {
        case 0: result.color = "gray"; result.icon = ""; break;//other
        case 1: result.color = "#FF6E6E"; result.icon = "icon-times"; break;//delete
        case 2: case 15: case 24: result.color = "#5CBD58"; result.icon = "icon-plus"; break;//insert
        case 3: case 16: case 25: result.color = "#FFC107"; result.icon = "icon-repeat"; break;//update
        case 4: case 17: case 26: result.color = "#4194E0"; result.icon = "icon-list"; break;//select

        case 5: result.color = "#5CBD58"; result.icon = "icon-file-text"; break;
        case 7: result.color = "#FFC107"; result.icon = "icon-file-text"; break;
        case 8: result.color = "#FF6E6E"; result.icon = "icon-file-text"; break;

        case 9: result.color = "#FF6E6E"; result.icon = "icon-shopping-cart"; break;
        case 10: result.color = "#5CBD58"; result.icon = "icon-shopping-cart"; break;
        case 11: result.color = "#FFC107"; result.icon = "icon-shopping-cart"; break;

        case 12: result.color = "#FF6E6E"; result.icon = "icon-archive"; break;
        case 13: result.color = "#FFC107"; result.icon = "icon-archive"; break;
        case 14: result.color = "#5CBD58"; result.icon = "icon-archive"; break;

        case 18: case 21: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 19: case 22: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 23: result.color = "#FF6E6E"; result.icon = "icon-dollar"; break;

        case 27: result.color = "#5CBD58"; result.icon = "icon-phone"; break;
        case 28: result.color = "#FFC107"; result.icon = "icon-phone"; break;
        case 29: result.color = "#FF6E6E"; result.icon = "icon-phone"; break;

        case 30: result.color = "#5CBD58"; result.icon = "icon-ivr-user"; break;
        case 31: result.color = "#FFC107"; result.icon = "icon-ivr-user"; break;
        case 32: result.color = "#FF6E6E"; result.icon = "icon-ivr-user"; break;

        case 33: result.color = "#6E74FF"; result.icon = "icon-eye"; break;

        case 35: result.color = "#FF6E6E"; result.icon = "icon-file-times"; break;
        case 36: result.color = "#FF6E6E"; result.icon = "icon-folder-open"; break;

        case 37: result.color = "#D261DB"; result.icon = "icon-workflow"; break;
        case 38: result.color = "#3B9437"; result.icon = "icon-excel"; break;

        case 51: result.color = "#F54F4F;"; result.icon = "icon-briefcase"; break;
        case 50: result.color = "#EBC503;"; result.icon = "icon-briefcase"; break;

        case 49: result.color = "#EBC503;"; result.icon = "icon-user"; break;
        case 48: result.color = "#5CBD58;"; result.icon = "icon-user"; break;
        case 115: result.color = "#F54F4F;"; result.icon = "icon-user"; break;


        case 44: result.color = "#5CBD58;"; result.icon = "icon-support"; break;
        case 45: result.color = "#BD58A9;"; result.icon = "icon-support"; break;

        case 46: result.color = "#586CBD;"; result.icon = "icon-copy"; break;
        case 47: result.color = "#F54F4F;"; result.icon = "icon-copy"; break;

        case 41: result.color = "#F54F4F;"; result.icon = "icon-male"; break;
        case 40: result.color = "#DDD50A;"; result.icon = "icon-male"; break;

        case 43: result.color = "#FF6E6E;"; result.icon = "icon-bookmark"; break;
        case 42: result.color = "#2CA527;"; result.icon = "icon-bookmark"; break;

        case 39: result.color = "#2CA527;"; result.icon = "icon-male"; break;

        case 52: result.color = "#5CBD58"; result.icon = "icon-folder-open"; break;
        case 53: result.color = "#9372E7"; result.icon = "icon-upload"; break;

        case 54: result.color = "#50C0AE"; result.icon = "icon-archive"; break;
        case 55: result.color = "#DDAB0B"; result.icon = "icon-archive"; break;

        case 46: result.color = "#19BBC9;"; result.icon = "icon-fax"; break;
        case 47: result.color = "#FF6E6E;"; result.icon = "icon-fax"; break;
        case 59: result.color = "#93B1BE;"; result.icon = "icon-fax"; break;

        case 56: result.color = "#5CBD58"; result.icon = "icon-inbox"; break;
        case 57: result.color = "#FFC107"; result.icon = "icon-inbox"; break;
        case 58: result.color = "#FF6E6E"; result.icon = "icon-inbox"; break;

        case 60: result.color = "#5CBD58"; result.icon = "icon-volume-up"; break;
        case 61: result.color = "#FF6E6E"; result.icon = "icon-volume-up"; break;
        case 62: result.color = "#93B1BE"; result.icon = "icon-volume-up"; break;
        case 63: result.color = "#54A54F"; result.icon = "icon-volume-up"; break;

        case 64: result.color = "#913898"; result.icon = "icon-workflow"; break;
        case 65: result.color = "#b8b8b8"; result.icon = "icon-workflow"; break;
        case 66: result.color = "#2BAED5"; result.icon = "icon-workflow"; break;
        case 67: result.color = "#F54F4F"; result.icon = "icon-workflow"; break;

        case 68: result.color = "#FFC107"; result.icon = "icon-workflow"; break;
        case 69: result.color = "#E40000"; result.icon = "icon-workflow"; break;

        case 70: result.color = "#5CBD58"; result.icon = "icon-cog"; break;
        case 71: result.color = "#FFC107"; result.icon = "icon-cog"; break;
        case 72: result.color = "#F54F4F"; result.icon = "icon-cog"; break;
        case 73: result.color = "#FFC107"; result.icon = "icon-cog"; break;


        case 74: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 75: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 76: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;
        case 77: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 78: result.color = "#FFC107"; result.icon = "icon-dollar"; break;


        case 79: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 80: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 81: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;

        case 82: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 83: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;
        case 84: result.color = "#FFC107"; result.icon = "icon-dollar"; break;

        case 85: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 86: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;
        case 87: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 88: result.color = "#FFC107"; result.icon = "icon-dollar"; break;

        case 89: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 90: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;
        case 91: result.color = "#FFC107"; result.icon = "icon-dollar"; break;

        case 92: result.color = "#5CBD58"; result.icon = "icon-dollar"; break;
        case 93: result.color = "#F54F4F"; result.icon = "icon-dollar"; break;
        case 94: result.color = "#FFC107"; result.icon = "icon-dollar"; break;

        case 95: result.color = "#BD58A9;"; result.icon = "icon-support"; break;
        case 96: result.color = "#BD58A9;"; result.icon = "icon-support"; break;

        case 97: result.color = "#2196F3;"; result.icon = "icon-plus-sign-alt"; break;
        case 98: result.color = "#2CA527;"; result.icon = "icon-plus-sign-alt"; break;

        case 99: result.color = "#5CBD58;"; result.icon = "icon-paperclip"; break;
        case 100: result.color = "#F54F4F;"; result.icon = "icon-paperclip"


        case 101: result.color = "#5cbd58"; result.icon = "icon-dollar"; break;
        case 102: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 103: result.color = "#ff6e6e"; result.icon = "icon-dollar"; break;
        case 104: result.color = "#ff6e6e"; result.icon = "icon-dollar"; break;
        case 105: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 106: result.color = "#5cbd58"; result.icon = "icon-list"; break;
        case 107: result.color = "#FFC107"; result.icon = "icon-list"; break;
        case 108: result.color = "#ff6e6e"; result.icon = "icon-list"; break;
        case 109: result.color = "#FFC107"; result.icon = "icon-dollar"; break;
        case 110: result.color = "#ff6e6e"; result.icon = "icon-dollar"; break;

        case 111: result.color = "#5CBD58"; result.icon = "icon-sign-in"; break;
        case 112: result.color = "#F54F4F"; result.icon = "icon-sign-in"; break;
        case 113: result.color = "#F54F4F"; result.icon = "icon-sign-in"; break;
        case 114: result.color = "#795548"; result.icon = "icon-sign-out"; break;
        case 116: result.color = "#E91E63"; result.icon = "icon-ban"; break;
        case 117: result.color = "#E91E63"; result.icon = "icon-upload"; break;
        case 118: result.color = "#EBC503"; result.icon = "icon-Key"; break;

        case 121: result.color = "#9372E7"; result.icon = "icon-upload"; break;
        case 122: result.color = "#5CBD58"; result.icon = "icon-file-text"; break;
        case 123: result.color = "#F54F4F"; result.icon = "icon-file-text"; break;

        case 124: result.color = "#FFC107"; result.icon = "icon-users"; break;
        case 125: result.color = "#FFC107"; result.icon = "icon-users"; break;
        case 126: result.color = "#5cbd58"; result.icon = "icon-users"; break;

        case 127: result.color = "#FFC107"; result.icon = "icon-file-text"; break;
        case 128: result.color = "#ff6e6e"; result.icon = "icon-file-text"; break;

        case 129: result.color = "#2ba9e3"; result.icon = "icon-share"; break;

        case 130: result.color = "#DDD50A"; result.icon = "icon-copy"; break;
        case 131: result.color = "#FFC107"; result.icon = "icon-exchange"; break
    }
    return result;
}