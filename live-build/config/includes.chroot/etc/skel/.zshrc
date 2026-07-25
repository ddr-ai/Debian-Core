# DainRaku OS — Default ZSH Configuration
# ~/.zshrc

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"

plugins=(
    git
    zsh-autosuggestions
    zsh-syntax-highlighting
    sudo
    docker
    kubectl
    python
    ruby
    golang
    colorize
    command-not-found
    history-substring-search
    fzf
)

source $ZSH/oh-my-zsh.sh

# ── Powerlevel10k ────────────────────────────────────────────────────────────
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

# ── Environment ──────────────────────────────────────────────────────────────
export EDITOR=nvim
export VISUAL=nvim
export PAGER=less
export LANG=en_US.UTF-8
export PATH="$HOME/.local/bin:$HOME/go/bin:/usr/local/go/bin:$PATH"
export GOPATH="$HOME/go"

# ── Metasploit database ───────────────────────────────────────────────────────
export MSF_DATABASE_CONFIG="$HOME/.msf4/database.yml"

# ── FZF ──────────────────────────────────────────────────────────────────────
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border --color=dark,bg+:#0d1117,hl:#00f0ff,hl+:#00f0ff,fg+:#e0e8f0,prompt:#00f0ff,pointer:#00f0ff'
[ -f /usr/share/doc/fzf/examples/key-bindings.zsh ] && source /usr/share/doc/fzf/examples/key-bindings.zsh

# ── Aliases — Navigation ──────────────────────────────────────────────────────
alias ls='ls --color=auto'
alias ll='ls -alFh --color=auto'
alias la='ls -Ah --color=auto'
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'
alias grep='grep --color=auto'
alias df='df -h'
alias du='du -h'
alias free='free -h'

# ── Aliases — Pentesting ──────────────────────────────────────────────────────
alias msf='msfconsole'
alias msfv='msfvenom'
alias bsuite='burpsuite'
alias zap='zaproxy'
alias bt='bettercap'
alias wt='wifite'
alias hcat='hashcat'
alias jtr='john'

# ── Aliases — Network ────────────────────────────────────────────────────────
alias myip='curl -s https://api.ipify.org && echo'
alias localip='ip addr show | grep "inet " | grep -v 127.0.0.1'
alias ports='ss -tulpn'
alias listening='ss -tulpn | grep LISTEN'
alias scanlocal='nmap -sn 192.168.1.0/24'

# ── Aliases — System ─────────────────────────────────────────────────────────
alias update='sudo apt update && sudo apt upgrade -y'
alias install='sudo apt install -y'
alias repos='sudo dainraku-switch-repos'
alias hwdetect='sudo dainraku-hwdetect'
alias snaplist='sudo snapper list'
alias snapcreate='sudo snapper create -d'

# ── Aliases — Security ───────────────────────────────────────────────────────
alias suid='find / -perm -4000 -type f 2>/dev/null'
alias world-write='find / -perm -o+w -type f 2>/dev/null'
alias linpeas='curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh'
alias cme='crackmapexec'
alias nxc='netexec'

# ── Functions ─────────────────────────────────────────────────────────────────
# Quick nmap scan
nq() { sudo nmap -sC -sV -O -oA nmap_$1 $1; }

# Extract archives
extract() {
    if [ -f $1 ]; then
        case $1 in
            *.tar.bz2)  tar xjf $1 ;;
            *.tar.gz)   tar xzf $1 ;;
            *.bz2)      bunzip2 $1 ;;
            *.rar)      unrar x $1 ;;
            *.gz)       gunzip $1 ;;
            *.tar)      tar xf $1 ;;
            *.tbz2)     tar xjf $1 ;;
            *.tgz)      tar xzf $1 ;;
            *.zip)      unzip $1 ;;
            *.Z)        uncompress $1 ;;
            *.7z)       7z x $1 ;;
            *)          echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# ── DainRaku OS welcome message ───────────────────────────────────────────────
echo ""
echo "  \033[0;36mDainRaku OS\033[0m \033[0;37m— Precision. Power. Penetration.\033[0m"
echo "  \033[0;90mKernel: $(uname -r) | IP: $(ip route get 1 2>/dev/null | awk '{print $7;exit}' 2>/dev/null || echo 'N/A')\033[0m"
echo ""
